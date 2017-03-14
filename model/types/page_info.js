import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLBoolean
} from 'graphql'
import videoCursorType from './video_cursor'

const readSchema = {
  name: 'pageInfo',
  description: 'a common page information type for providing full list pagination details',
  fields: {
    next_page_cursor: {
      type: videoCursorType.read,
      description: 'the cursor representing the first item in the next available page'
    },
    has_next_page: {
      type: GraphQLBoolean,
      description: 'a boolean describing whether or not there are more pages after the current query'
    }
  }
}

export default {
  readSchema,
  read: new GraphQLObjectType(readSchema)
}
