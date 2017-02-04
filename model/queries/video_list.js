/**
 * Query for getting paginated lists of videos for channels
 */
import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID
} from 'graphql'
import video from '/model/types/video'

export default {
  name: 'videoList',
  description: 'query for retrieving paginated lists of videos for a channel',
  type: cursorManager,
  args: {
    first: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the maximum number of list items that should be returned'
    },
    cursor: {
      type: GraphQLID,
      description: 'the cursor id for where the current page should start from'
    }
  },
  resolve(channel, { first, cursor }, { DB }){

    const params = {
      TableName: video.table,
      Key: {
        channel_id: channel.slug
      },
      Limit: 20
    }

    if(cursor){
      params.ExclusiveStartKey = {
        channel_position: cursor
      }
    }

    return DB.query(params)
  }
}
