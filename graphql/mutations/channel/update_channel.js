import { GraphQLNonNull } from 'graphql'
import { channelType, channelInputType } from 'graphql/types/channel'

export default {
  type: channelType,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(channelInputType)
    }
  },
  resolve (root, { data }, options) {

    const params = {
      TableName: 'churn-channels',
      Key: data.slug,
      
    }

    return docClient.put(params)
  }
}