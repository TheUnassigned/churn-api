import { or } from 'twobyfour'
import channelType from '/model/types/channel'
import { isAdmin, isChannelAdmin } from '/model/permissions'
import { flatten } from '/dynamodb/expression_builder'

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
  permissions: or([
    isAdmin, isChannelAdmin(({ slug }) => slug)
  ]),
  resolve (root, { slug, channel }, { DB }) {
    return DB.updateResource({
      TableName: channelType.table,
      Key: { slug },
      ConditionExpression: 'attribute_exists(slug)',
      SET: flatten(channel),
      ReturnValues: 'ALL_NEW'
    }).then(result => result.Attributes)
      .catch(e => {
        if(e.code === 'ConditionalCheckFailedException'){
          e.message = `Channel with slug (${slug}) does not exist`
        }
        throw e
      })
  }
}
