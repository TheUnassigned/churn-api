import channelType from '/model/types/channel'

export default {
  type: channelType.read,
  description: 'Find a certain channel by slug id',
  args: {
    slug: channelType.keys.slug
  },
  resolve (root, args, { DB }, info) {
    return DB.getResource({
      TableName: channelType.table,
      Key: args
    })
  }
}
