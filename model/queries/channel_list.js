import channelType from '/model/types/channel'
import debugCreator from 'debug'

const debug = debugCreator('churnapi:queries:channel_list')

export default {
  type: new GraphQLList(channelType.read),
  description: 'List all channels in churn',
  resolve (root, args, { DB }, info ) {
    const params = {
      TableName: channelType.table,
      Limit: 50
    }
    return DB.query(params)
      .then(result => debug(result); return result)
  }
}
