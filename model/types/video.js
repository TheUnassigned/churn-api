import { Types } from '../../twobyfour'

export default {
  name: 'video',
  fields: {
    url: {
      type: Types.String,
      description: 'The URL by which the video was added',
    },
    channel_id: {
      type: Types.String,
      description: 'The slug id of the owning channel',
    },
    channel_position: {
      type: Types.Int,
      description: 'the order of the video in the channel (reverse)',
    },
    youtube_id: {
      type: Types.String,
      description: 'The Youtube video id',
    },
    time_added: {
      type: Types.String,
      description: 'When the video was added to the channel',
    },
    title: {
      type: Types.String,
      description: 'The title of the video',
    },
    duration: {
      type: Types.Int,
      description: 'Duration of the video in seconds',
    }
  }
}