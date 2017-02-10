/**
 * cursor manager used to do pagination of videos
 */
import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType
} from 'graphql'
import pageInfo from './page_info'
import videoEdge from './video_edge'
import twobyfour from '/config/twobyfour'

// build the schema
const readSchema = {
  name: 'cursorManager',
  description: 'cursor management for interacting with paginated lists',
  fields: {
    edges: {
      type: new GraphQLList(videoEdge.read),
      description: 'the list of edges found for the current page'
    },
    page_info: {
      type: pageInfo.read,
      description: 'the page cursor information used to help paginate'
    }
  }
}

export default {
  readSchema,
  read: twobyfour(GraphQLObjectType, readSchema)
}
