import twobyfour, { or } from '/config/twobyfour'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import videoType, { VIDEO_TABLE } from '/model/types/video'
import { isLength, isURL, isSlug } from '/model/validators'

// add a video object to the channel collection
// This adds to recent videos and returns the video position
// where the actual video object should be added
const addVideoToChannel = (slug, video) => DB.updateResource({
  TableName: channelType.COLLECTION,
  Key: { slug },
  Expected: {
    slug: { Exists: true }
  },
  LIST_APPEND: {
    recent_videos: {
      front: video
    }
  },
  LIST_REMOVE: {
    recent_videos: [5]
  },
  ADD: {
    total_videos: 1
  }
}).then(({ total_videos }) => total_videos)

// The add video mutation schema
export default {
  name: 'addVideo',
  description: 'Add a video to a particular channel',
  type: videoType,
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
    return videoMeta(video_url).then(video =>
      // update channel collection, and the channels recent video set
      addVideoToChannel(channel_slug, video).then(pos => {
        video.pos = pos
        DB.putResource({
          TableName: VIDEO_TABLE,
          Item: video
        })
        // finally we want to return the video object
        .then(() => video)
      })
    )
  }
}
