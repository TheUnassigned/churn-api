import { or } from 'twobyfour'
import channelType from '/model/types/channel'
import { isAdmin, isChannelAdmin } from '/model/permissions'

export default {
  name: 'updateChannel',
  description: 'update an existing channel',
  type: channelType.read,
  args: {
    slug: channelType.keys.slug,
    channel: {
      type: channelType.input,
      description: 'The updated channel object details'
    }
  },
  permissions: or([isAdmin, isChannelAdmin]),
  resolve (root, { slug, channel }, { DB }) {
    return DB.updateResource({
      TableName: channelType.table,
      Key: { slug },
      Expected: {
        slug: { Exists: true }
      },
      SET: channel
    }).then(() => ({ slug, ...channel }))
      .catch(e => {
        if(e.code === 'ConditionalCheckFailedException'){
          e.message = `Channel with slug (${slug}) does not exist`
        }
        throw e
      })
  }
}
