import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import twobyfour from '/config/twobyfour'

const readSchema = {
  name: 'recentVideo',
  fields: {
    channel_position: {
      type: GraphQLInt,
      description: 'The position of the recent video in the channel. Also the lookup id.'
    },
    youtube_id: {
      type: GraphQLString,
      description: 'The youtube if of the recent video'
    },
    title: {
      type: GraphQLString,
      description: 'The title of the recent video'
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the recent video'
    }
  },
  resolve(channel, params, context, info) {
    return channel.recent_videos
  }
}

export {
  readSchema,
  read: twobyfour(GraphQLObjectType, readSchema)
}
