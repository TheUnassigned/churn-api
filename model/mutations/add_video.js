import { or } from 'twobyfour'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import videoType from '/model/types/video'
import channelType from '/model/types/channel'
import videoMeta from '/model/meta'
import { isLength, isURL, isSlug } from '/model/validators'
import { isAdmin, isChannelAdmin } from '/model/permissions'
import debugCreator from 'debug'

const debug = debugCreator('churnapi:mutations:add_video')

// add a video object to the channel collection
// This adds to recent videos and returns the video position
// where the actual video object should be added
const addVideoToChannel = (slug, video, DB) => DB.updateResource({
  TableName: channelType.table,
  Key: { slug },
  ConditionExpression: 'attribute_exists(slug)',
  LIST_FRONT: {
    recent_videos: [video]
  },
  ADD: {
    total_videos: 1
  },
  ReturnValues: 'ALL_NEW'
}).then(({ Attributes }) => Attributes)

// second call to ensure recent videos doesn't grow too large
// this is because dynamodb isnt able to add and remove from the same
// list within a single call (AWESOME!)
const removeRecentTail = (slug, DB) => DB.updateResource({
  TableName: channelType.table,
  Key: { slug },
  ConditionExpression: 'attribute_exists(slug)',
  LIST_REMOVE: {
    'recent_videos[5]': null
  },
  ReturnValues: 'ALL_NEW'
}).then(({ Attributes }) => Attributes)

// The add video mutation schema
export default {
  name: 'addVideo',
  description: 'Add a video to a particular channel',
  type: videoType.read,
  args: {
    channel_slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The slug id of the channel to add the video to',
      validators: [isLength(1, 64), isSlug]
    },
    video_url: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The Youtube URL of the video to add',
      validators: isURL()
    }
  },
  permissions: or([
    isAdmin,
    isChannelAdmin(({ channel_slug }) => channel_slug)
  ]),
  resolve(root, { channel_slug, video_url }, { DB }, info){
    // run meta
    return videoMeta(video_url).then(video => {
      // update channel collection, and the channels recent video set
      return addVideoToChannel(channel_slug, video, DB).then(channel => {
        if(channel.total_videos > 5){
          return removeRecentTail(channel_slug, DB)
        }else{
          return channel
        }
      }).then(channel => {
        video.channel_id = channel.slug
        video.channel_position = channel.total_videos
        video.time_added = new Date().getTime()
        debug(channel)
        debug(video)
        return DB.putResource({
          TableName: videoType.table,
          Item: video
        })
        // finally we want to return the video object
        .then(() => video)
      })
    })
  }
}
