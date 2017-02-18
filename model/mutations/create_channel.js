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
  resolve (root, { slug, channel }, { DB }) {
    const newChannel = {
      slug,
      ...channel,
      recent_videos: []
    }

    return DB.putResource({
      TableName: channelType.table,
      Item: newChannel,
      ConditionExpression: 'attribute_not_exists(slug)'
    }).then(() => newChannel)
      .catch(e => {
        if(e.code === 'ConditionalCheckFailedException'){
          e.message = `Channel with slug (${slug}) already exists`
        }
        throw e
      })
  }
}
