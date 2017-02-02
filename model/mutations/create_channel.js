import channelType from '/model/types/channel'
import channelInputType from '/model/types/channel_input'
//import { isAdmin } from '../permissions'

export default {
  name: 'createChannel',
  description: 'create a new channel',
  type: channelType,
  args: {
    channel: {
      type: channelInputType,
      description: 'The input channel object details'
    }
  },
  permissions: isAdmin,
  resolve (root, { channel }, { DB }) {
    return DB.putResource({
      TableName: channelType.TABLE_NAME,
      Item: channel,
      Expected: {
        slug: { Exists: false }
      }
    }).then(() => channel)
  }
}
