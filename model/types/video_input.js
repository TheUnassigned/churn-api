import { Types } from '../../twobyfour'
import { isURL } from '../validators'

export default {
  name: 'videoInput',
  input: true,
  fields: {
    channel_id: {
      type: Types.String,
      required: true,
      description: 'The slug id of the owning channel'
    },
    url: {
      type: Types.String,
      required: true,
      description: 'The URL of the video to be added to the channel',
      validators: isURL()
    }
  }
}