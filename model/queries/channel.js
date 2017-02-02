import channelType, { CHANNEL_TABLE } from '/model/types/channel'
import { channelInputSchema } from '/model/types/channel_input'
import { or } from '/config/temp_twobyfour'

export default {
  type: channelType,
  description: 'Find a certain channel by slug id',
  args: {
    slug: channelInputSchema.fields.slug
  },
  resolve (root, params, context, info) {
    return context.DB.getResource({
      TableName: CHANNEL_TABLE,
      Key: params
    }, context)
  }
}
