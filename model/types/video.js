import { Types } from 'twobyfour'

export default {
  TABLE_NAME: 'churn-videos',
  name: 'video',
  fields: {
    url: {
      type: Types._string,
      description: 'The URL by which the video was added',
    },
    channel_id: {
      type: Types._string,
      description: 'The slug id of the owning channel',
    },
    channel_position: {
      type: Types._int,
      description: 'the order of the video in the channel (reverse)',
    },
    youtube_id: {
      type: Types._string,
      description: 'The Youtube video id',
    },
    time_added: {
      type: Types._string,
      description: 'When the video was added to the channel',
    },
    title: {
      type: Types._string,
      description: 'The title of the video',
    },
    duration: {
      type: Types._int,
      description: 'Duration of the video in seconds',
    }
  }
}