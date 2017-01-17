import { Types } from '../../twobyfour'

export default {
  name: 'recentVideo',
  fields: {
    channel_position: {
      type: Types.Int,
      description: 'The position of the recent video in the channel. Also the lookup id.'
    },
    youtube_id: {
      type: Types.String,
      description: 'The youtube if of the recent video'
    },
    title: {
      type: Types.String,
      description: 'The title of the recent video'
    },
    duration: {
      type: Types.Int,
      description: 'The duration of the recent video'
    }
  },
  resolve(channel, params, context) {
    return channel.recent_videos
  }
}