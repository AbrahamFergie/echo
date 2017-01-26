import {GraphQLFloat, GraphQLInt} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

import {STAT_DESCRIPTORS} from 'src/common/models/stat'

export default new GraphQLObjectType({
  name: 'UserProjectStats',
  description: 'A user\'s stats for a project',
  fields: () => {
    return {
      [STAT_DESCRIPTORS.CHALLENGE]: {type: GraphQLFloat, description: 'Challenge'},
      [STAT_DESCRIPTORS.CULTURE_CONTRIBUTION]: {type: GraphQLFloat, description: 'Culture contribution'},
      [STAT_DESCRIPTORS.ESTIMATION_ACCURACY]: {type: GraphQLFloat, description: 'Estimation accuracy'},
      [STAT_DESCRIPTORS.ESTIMATION_BIAS]: {type: GraphQLFloat, description: 'Estimation bias'},
      [STAT_DESCRIPTORS.EXPERIENCE_POINTS]: {type: GraphQLFloat, description: 'Experience points'},
      [STAT_DESCRIPTORS.FLEXIBLE_LEADERSHIP]: {type: GraphQLFloat, description: 'Flexible leadership score'},
      [STAT_DESCRIPTORS.FRICTION_REDUCTION]: {type: GraphQLFloat, description: 'Friction reduction score'},
      [STAT_DESCRIPTORS.PROJECT_HOURS]: {type: GraphQLFloat, description: 'Hours spent contributing to the project'},
      [STAT_DESCRIPTORS.RATING_ELO]: {type: GraphQLInt, description: 'Elo Rating'},
      [STAT_DESCRIPTORS.RECEPTIVENESS]: {type: GraphQLFloat, description: 'Receptiveness score'},
      [STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION]: {type: GraphQLFloat, description: 'Estimated contribution'},
      [STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION_DELTA]: {type: GraphQLFloat, description: 'Contribution delta'},
      [STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION_EXPECTED]: {type: GraphQLFloat, description: 'Expected contribution'},
      [STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION_HOURLY]: {type: GraphQLFloat, description: 'Contribution per hour'},
      [STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION_OTHER]: {type: GraphQLFloat, description: 'Teammate-rated relative contribution'},
      [STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION_SELF]: {type: GraphQLFloat, description: 'Self-rated relative contribution'},
      [STAT_DESCRIPTORS.RESULTS_FOCUS]: {type: GraphQLFloat, description: 'Results focus score'},
      [STAT_DESCRIPTORS.TEAM_PLAY]: {type: GraphQLFloat, description: 'Team play'},
      [STAT_DESCRIPTORS.TECHNICAL_HEALTH]: {type: GraphQLFloat, description: 'Technical support'},
    }
  }
})
