
import { dynamoProject } from 'graphql/get_projection'

export default {
  type: channelType,
  args: {
    slug: {
      name: 'slug',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve (root, { slug }, context) {
    const projection = dynamoProjection(options.fieldASTs[0])

    const params = {
      TableName: 'churn-channels',
      Key: {
        slug
      }
    }

    return docClient.get(params)
  }
}