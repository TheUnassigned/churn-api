import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'
import twobyfour from '/config/twobyfour'
import video from './video'
import videoList from '/model/queries/video_list'
import externalLinks from './external_links'
import { isLength, isSlug, isURL } from '/model/validators'

const table = 'churn-channels'

const descriptions = {
  slug: 'URL slug for the channel and also primary id',
  title: 'The title of the channel',
  blurb: 'A blurb explaining what the channel is about',
  logo_url: 'The URL of the logo image for the channel',
  external_links: 'A set of out links to related channel pages and social media',
  total_videos: 'The total number of videos added to the channel',
  recent_videos: 'The list of most recently added videos',
  videos: 'Paginating list of all videos in the channel'
}

const keys = {
  slug: {
    type: new GraphQLNonNull(GraphQLString),
    description: descriptions.slug,
    validators: [isLength(1, 64), isSlug]
  }
}

const readSchema = {
  name: 'channel',
  description: 'Type representing a single channel',
  fields: {
    slug: {
      type: GraphQLString,
      description: descriptions.slug
    },
    title: {
      type: GraphQLString,
      description: descriptions.title
    },
    blurb: {
      type: GraphQLString,
      description: descriptions.blurb
    },
    logo_url: {
      type: GraphQLString,
      description: descriptions.logo_url
    },
    external_links: {
      type: externalLinks.read,
      description: descriptions.external_links
    },
    total_videos: {
      type: GraphQLInt,
      description: descriptions.total_videos
    },
    recent_videos: {
      type: new GraphQLList(video.read),
      description: descriptions.recent_videos
    },
    videos: videoList
  }
}

const inputSchema = {
  name: 'channelInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: descriptions.title,
      validators: isLength(1, 128)
    },
    blurb: {
      type: new GraphQLNonNull(GraphQLString),
      description: descriptions.blurb,
      validators: isLength(1, 256)
    },
    logo_url: {
      type: new GraphQLNonNull(GraphQLString),
      description: descriptions.logo_url,
      validators: isURL()
    },
    external_links: {
      type: externalLinks.input,
      description: descriptions.external_links
    }
  }
}

export default {
  table,
  keys,
  readSchema,
  inputSchema,
  read: twobyfour(GraphQLObjectType, readSchema),
  input: twobyfour(GraphQLInputObjectType, inputSchema)
}
