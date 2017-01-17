
import { channel, channelInput } from '../types'

export default {
  description: 'create a new channel',
  type: channel,
  args: {
    channel: channelInput
  },
  permissions: [],
  resolve (root, params, context) {
    return context.DB.putResource(channel.TABLE_NAME, params, context)
  }
}