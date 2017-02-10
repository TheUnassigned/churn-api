import channelType from '/model/types/channel'
import { isChannelAdmin } from '/model/permissions'

export default {
  name: 'updateChannel',
  description: 'update an existing channel',
  type: channelType.read,
  args: {
    channel: {
      type: channelType.input,
      description: 'The input channel object details'
    }
  },
  permissions: isChannelAdmin,
  resolve (root, { channel }, { DB }) {
    return DB.updateResource({
      TableName: channelType.table,
      Key: { slug: channel.slug },
      Expected: {
        slug: { Exists: true }
      },
      SET: channel
    }).then(() => channel)
  }
}
