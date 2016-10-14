import r from 'src/db/connect'
import ChatClient from 'src/server/clients/ChatClient'

export default function sendCycleLaunchAnnouncement(cycle, projects, options = {}) {
  const chatClient = options.chatClient || new ChatClient()
  const projectListString = projects.map(p => `#${p.name} - _${p.goal.title}_`).join('\n  • ')
  const announcement = `🚀  *The cycle has been launched!*
The following projects have been created:
  • ${projectListString}`

  return r.table('chapters').get(cycle.chapterId).run()
    .then(chapter => chatClient.sendChannelMessage(chapter.channelName, announcement))
}
