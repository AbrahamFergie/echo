import r from '../../db/connect'
import {getQueue, getSocket, graphQLFetcher} from '../util'
import ChatClient from '../../server/clients/ChatClient'
import {formProjects} from '../../server/actions/formProjects'
import {findModeratorsForChapter} from '../../server/db/moderator'
import {getTeamPlayerIds, getProjectsForChapterInCycle} from '../../server/db/project'
import {update as updateCycle} from '../../server/db/cycle'
import {CYCLE_STATES} from '../../common/models/cycle'

export function start() {
  const cycleLaunched = getQueue('cycleLaunched')
  cycleLaunched.process(async function({data: cycle}) {
    try {
      await processCycleLaunch(cycle)
      console.log(`Cycle ${cycle.id} successfully launched`)
    } catch (err) {
      await _handleCycleLaunchError(cycle, err)
    }
  })
}

function processCycleLaunch(cycle) {
  console.log(`Forming teams for cycle ${cycle.cycleNumber} of chapter ${cycle.chapterId}`)
  return formProjects(cycle.id)
    .then(async function() {
      const projects = await getProjectsForChapterInCycle(cycle.chapterId, cycle.id)
      await Promise.all(projects.map(project => {
        return initializeProjectChannel(project.name, getTeamPlayerIds(project, cycle.id), project.goal)
      }))
      return sendCycleLaunchAnnouncement(cycle, projects)
    })
}

async function initializeProjectChannel(channelName, playerIds, goal) {
  console.log(`Initializing project channel ${channelName}`)
  const goalIssueNum = goal.url.replace(/.*\/(\d+)$/, '$1')
  const goalLink = `[${goalIssueNum}: ${goal.title}](${goal.url})`
  const client = new ChatClient()

  const players = await getPlayerInfo(playerIds)
  await client.createChannel(channelName, players.map(p => p.handle).concat('echo'), goalLink)

  // Split welcome message into 2 so that the goal link preview
  // is inserted right after the goal link.
  const projectWelcomeMessage1 = `🎊 *Welcome to the ${channelName} project channel!* 🎊

*Your goal is:* ${goalLink}
`

  const projectWelcomeMessage2 = `*Your team is:*
  ${players.map(p => `• _${p.name}_ - @${p.handle}`).join('\n  ')}

*Time to start work on your project!*

The first step is to create an appropriate project artifact.
Once you've created the artifact, connect it to your project with the \`/project set-artifact\` command.

Run \`/project set-artifact --help\` for more guidance.
`

  await client.sendMessage(channelName, projectWelcomeMessage1)
  await client.sendMessage(channelName, projectWelcomeMessage2)
}

function getPlayerInfo(playerIds) {
  return graphQLFetcher(process.env.IDM_BASE_URL)({
    query: 'query ($playerIds: [ID]!) { getUsersByIds(ids: $playerIds) { handle name } }',
    variables: {playerIds},
  }).then(result => result.data.getUsersByIds)
}

function sendCycleLaunchAnnouncement(cycle, projects) {
  const projectListString = projects.map(p => `#${p.name} - _${p.goal.title}_`).join('\n  • ')
  const announcement = `🚀  *The cycle has been launched!*
The following projects have been created:
  • ${projectListString}`
  const client = new ChatClient()

  return r.table('chapters').get(cycle.chapterId).run()
    .then(chapter => client.sendMessage(chapter.channelName, announcement))
}

async function _handleCycleLaunchError(cycle, err) {
  console.error('Cycle launch error:', err)
  if (process.env !== 'production') {
    console.error(err.stack)
  }

  const socket = getSocket()

  try {
    // reset cycle state to GOAL_SELECTION
    console.log(`Resetting state for cycle ${cycle.id} to GOAL_SELECTION`)
    const goalSelectionCycleState = CYCLE_STATES[0] // FIXME: yuck!
    await updateCycle({id: cycle.id, state: goalSelectionCycleState})
  } catch (err) {
    console.error('Cycle state reset error:', err)
  }

  // delete any projects that were created
  await getProjectsForChapterInCycle(cycle.chapterId, cycle.id).delete()

  try {
    console.log(`Notifying moderators of chapter ${cycle.chapterId} of cycle launch error`)
    await findModeratorsForChapter(cycle.chapterId).then(moderators => {
      moderators.forEach(moderator => {
        socket.publish(`notifyUser-${moderator.id}`, `Cycle Launch Error: ${err.message}`)
      })
    })
  } catch (err) {
    console.error('Moderator notification error:', err)
  }
}
