import {
  GraphQLObjectType,
  GraphQLID
} from 'graphql'
import videoType from './video'

const readSchema = {
  name: 'videoEdge',
  description: 'an edge type that represents a video relationship to a channel',
  fields: {
    cursor: {
      type: GraphQLID,
      description: 'the generic cursor of the node used for pagination',
      resolve: ({ channel_id, youtube_id, channel_position }) => ({
        channel_id,
        youtube_id,
        channel_position
      })
    },
    video: {
      type: videoType.read,
      description: 'the member node',
      resolve: video => video
    }
  }
}

export default {
  readSchema,
  read: new GraphQLObjectType(readSchema)
}
