import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'

const table = 'churn-videos'

const readSchema = {
  name: 'video',
  fields: {
    url: {
      type: GraphQLString,
      description: 'The URL by which the video was added',
    },
    channel_id: {
      type: GraphQLString,
      description: 'The slug id of the owning channel',
    },
    channel_position: {
      type: GraphQLInt,
      description: 'the order of the video in the channel (reverse)',
    },
    youtube_id: {
      type: GraphQLString,
      description: 'The Youtube video id',
    },
    time_added: {
      type: GraphQLString,
      description: 'When the video was added to the channel',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video',
    },
    duration: {
      type: GraphQLInt
      description: 'Duration of the video in seconds',
    }
  }
}

export {
  table,
  keys,
  readSchema,
  twobyfour(GraphQLObjectType, readSchema)
}
