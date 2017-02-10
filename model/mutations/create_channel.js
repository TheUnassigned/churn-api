import channelType from '/model/types/channel'
import { isAdmin } from '/model/permissions'

export default {
  name: 'createChannel',
  description: 'create a new channel',
  type: channelType.read,
  args: {
    slug: channelType.keys.slug,
    channel: {
      type: channelType.input,
      description: 'The input channel object details'
    }
  },
  permissions: isAdmin,
  resolve (root, { channel }, { DB }) {
    return DB.putResource({
      TableName: channelType.table,
      Item: channel,
      Expected: {
        slug: { Exists: false }
      }
    }).then(() => channel)
  }
}
