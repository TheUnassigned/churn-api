import {
  GraphQLObjectType,
  GraphQLID
} from 'graphql'
import video from './video'
import twobyfour from '/config/twobyfour'

const readSchema = {
  name: 'videoEdge',
  description: 'an edge type that represents a video relationship to a channel',
  fields: {
    cursor: {
      type: GraphQLID,
      description: 'the generic cursor of the node used for pagination',
      resolve: video => video.youtube_id
    },
    video: {
      type: user.read,
      description: 'the member node'
    }
  }
}

export default {
  collection,
  readSchema,
  read: twobyfour(GraphQLObjectType, readSchema)
}
