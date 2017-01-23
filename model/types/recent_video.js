import { Types } from 'twobyfour'

export default {
  name: 'recentVideo',
  fields: {
    channel_position: {
      type: Types._int,
      description: 'The position of the recent video in the channel. Also the lookup id.'
    },
    youtube_id: {
      type: Types._string,
      description: 'The youtube if of the recent video'
    },
    title: {
      type: Types._string,
      description: 'The title of the recent video'
    },
    duration: {
      type: Types._int,
      description: 'The duration of the recent video'
    }
  },
  resolve(channel, params, context) {
    return channel.recent_videos
  }
}