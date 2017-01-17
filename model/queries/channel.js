
import { channel } from '../types'

export default {
  type: channel,
  args: {
    slug: channel.fields.slug,
  },
  permissions: [
    /*Permissions.channelOwner,
    (args, { token }) => {
      if(args.slug !== token.channel){
        return Promise.reject(new Error('You must be channel owner to run this query'))
      }
    },
    (args, { DB }) => {
      return DB.getResource('someresource', args.something)
        .then(item => {
          if(item.name !== 'person'){
            return Promise.reject(new Error('Some thing inside some resource doesn\'t check out'))
          }
        })
    }*/
  ],
  resolve (root, params, context) {
    return context.DB.getResource(channel.TABLE_NAME, params, context)
  }
}