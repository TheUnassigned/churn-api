/**
 * Query for getting paginated lists of videos for channels
 */
import {
  GraphQLNonNull,
  GraphQLInt
} from 'graphql'
import video from '/model/types/video'
import cursorManager from '/model/types/cursor_manager'
import videoCursorType from '/model/types/video_cursor'
import { range  } from '/model/validators'

export default {
  name: 'videoList',
  description: 'query for retrieving paginated lists of videos for a channel',
  type: cursorManager.read,
  args: {
    first: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the maximum number of list items that should be returned',
      validators: range(1, 30)
    },
    cursor: {
      type: videoCursorType.input,
      description: 'the cursor id for where the current page should start from'
    }
  },
  resolve(channel, { first, cursor }, { DB }){

    const params = {
      TableName: video.table,
      KeyConditionExpression: '#channel_id = :slug',
      ExpressionAttributeNames:{
        '#channel_id': 'channel_id'
      },
      ExpressionAttributeValues: {
        ':slug': channel.slug
      },
      IndexName: 'videoPositionIndex',
      ScanIndexForward: false,
      Limit: first
    }

    if(cursor){
      params.ExclusiveStartKey = cursor
    }

    return DB.query(params).then(result => {
      const Items = result.Items
      // set the page info details
      const pageInfo = { has_next_page: false }
      if(result.LastEvaluatedKey){
        pageInfo.has_next_page = true
        pageInfo.next_page_cursor = result.LastEvaluatedKey
      }

      // trime the last item off that we used to determine page info
      const output = {
        pageInfo,
        edges: Items
      }

      return output
    })
  }
}
