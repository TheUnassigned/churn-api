import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'
import twobyfour from '/config/twobyfour'
import recentVideo from './recent_video'

const table = 'churn-channels'

const keys = {
  slug: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'The URL slug of the channel',
    validators: [isLength(1, 64), isSlug]
  }
}

const readSchema = {
  name: 'channel',
  description: 'Type representing a single channel',
  fields: {
    slug: {
      type: GraphQLString,
      description: 'URL slug for the channel and also primary id'
    },
    title: {
      type: GraphQLString,
      description: 'The title of the channel'
    },
    blurb: {
      type: GraphQLString,
      description: 'A blurb explaining what the channel is about'
    },
    logo_url: {
      type: GraphQLString,
      description: 'The URL of the logo image for the channel'
    },
    external_url: {
      type: GraphQLString,
      description: 'The external URL related to the channel'
    },
    external_facebook: {
      type: GraphQLString,
      description: 'The facebook URL related to the channel'
    },
    external_twitter: {
      type: GraphQLString,
      description: 'The twitter URL related to the channel'
    },
    external_instagram: {
      type: GraphQLString,
      description: 'The instagram URL related to the channel'
    },
    total_videos: {
      type: GraphQLInt,
      description: 'The number of videos added to the channel, which doubles as a video position helper'
    },
    recent_videos: {
      type: new GraphQLList(recentVideo),
      description: 'The list of most recently added videos',
    },
    videos: {
      type: videoList,
      description: 'Paginating list of all videos in the channel'
    }
  }
}

const inputSchema = {
  name: 'channelInput',
  fields: {
    title: {
      type: GraphQLString,
      description: 'The title of the channel',
      validators: isLength(1, 64)
    },
    blurb: {
      type: GraphQLString,
      description: 'A blurb explaining what the channel is about',
      validators: isLength(1, 256)
    },
    logo_url: {
      type: GraphQLString,
      description: 'The URL of the logo image for the channel',
      validators: [
        isURL()
      ]
    },
    external_url: {
      type: GraphQLString,
      description: 'The external URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_facebook: {
      type: GraphQLString,
      description: 'The facebook URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_twitter: {
      type: GraphQLString,
      description: 'The twitter URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_instagram: {
      type: GraphQLString,
      description: 'The instagram URL related to the channel',
      validators: [
        isURL()
      ]
    }
  }
}

export {
  table,
  keys,
  readSchema,
  inputSchema,
  read: twobyfour(GraphQLObjectType, readSchema)
  input: twobyfour(GraphQLInputObjectType, inputSchema)
}
