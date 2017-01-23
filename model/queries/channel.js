
import { channel, channelInput } from '../types'

export default {
  type: channel,
  description: 'Find a certain channel by slug id',
  args: {
    slug: channelInput.fields.slug,
  },
  resolve (root, params, context, info) {
    return context.DB.getResource({
      TableName: channel.TABLE_NAME,
      Key: params
    }, context)
  }
}