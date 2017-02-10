import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString
} from 'graphql'
import { isURL } from '/model/validators'
import twobyfour from '/config/twobyfour'

const descriptions = {
  url: 'The URL related to the channel',
  facebook: 'The facebook URL related to the channel',
  twitter: 'The twitter URL related to the channel',
  instagram: 'The instagram URL related to the channel'
}

const readSchema = {
  name: 'externalLinks',
  description: 'the query (read) type representing external site and social media links',
  fields: {
    url: {
      type: GraphQLString,
      description: descriptions.url
    },
    facebook: {
      type: GraphQLString,
      description: descriptions.facebook
    },
    twitter: {
      type: GraphQLString,
      description: descriptions.twitter
    },
    instagram: {
      type: GraphQLString,
      description: descriptions.instagram
    }
  },
  resolve: ({ external_links }) => external_links
}

const inputSchema = {
  name: 'externalLinksInput',
  description: 'the input type representing external site and social media links',
  fields: {
    url: {
      type: GraphQLString,
      description: descriptions.url,
      validators: isURL()
    },
    facebook: {
      type: GraphQLString,
      description: descriptions.facebook,
      validators: isURL()
    },
    twitter: {
      type: GraphQLString,
      description: descriptions.twitter,
      validators: isURL()
    },
    instagram: {
      type: GraphQLString,
      description: descriptions.instagram,
      validators: isURL()
    }
  }
}

export default {
  readSchema,
  inputSchema,
  read: twobyfour(GraphQLObjectType, readSchema),
  input: twobyfour(GraphQLInputObjectType, inputSchema)
}
