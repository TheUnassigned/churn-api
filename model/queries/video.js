import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import channelType from '/model/types/channel'
import videoType from '/model/types/video'

export default {
  type: videoType.read,
  description: 'Find a certain video in a particular channel',
  args: {
    channel_id: channelType.keys.slug,
    video_id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the youtube id of the video'
    }
  },
  resolve (root, { channel_id, video_id }, { DB }, info) {
    const params = {
      TableName: videoType.table,
      Key: {
        channel_id,
        youtube_id: video_id
      }
    }
    
    return DB.getResource(params)
  }
}
