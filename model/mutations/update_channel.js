import { channel as channelType, channelInput } from '../types'
import expression from 'dynamodb'
import { isAdmin } from '../permissions'

export default {
  name: 'updateChannel',
  description: 'update an existing channel',
  type: channelType,
  args: {
    channel: {
      type: channelInput,
      description: 'The input channel object details'
    }
  },
  permissions: isAdmin,
  resolve (root, { channel }, { DB }) {
    return DB.updateResource({
      TableName: channelType.TABLE_NAME,
      Key: { slug: channel.slug },
      Expected: {
        slug: { Exists: true }
      },
      ...expression().SET(args.channel).build()
    }).then(() => params.channel)
  }
}