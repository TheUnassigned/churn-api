import channelType from '/model/types/channel'
import channelInputType from '/model/types/channel_input'
import expression from '/dynamodb'
//import { isAdmin } from '../permissions'

export default {
  name: 'updateChannel',
  description: 'update an existing channel',
  type: channelType,
  args: {
    channel: {
      type: channelInputType,
      description: 'The input channel object details'
    }
  },
  permissions: isChannelAdmin,
  resolve (root, { channel }, { DB }) {
    return DB.updateResource({
      TableName: channelType.TABLE_NAME,
      Key: { slug: channel.slug },
      Expected: {
        slug: { Exists: true }
      },
      SET: channel
    }).then(() => channel)
  }
}
