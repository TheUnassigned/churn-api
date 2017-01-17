
import graphql, { GraphQLString, } from 'graphql'

/**
  abstract schema structure for channels
*/
export const videoSchema = {
  fields: {
    readAndInput: {
      url: {
        type: GraphQLString,
        description: 'The url by which the video was added'
      }
    },
    readOnly: {
    	channel_id: { 
        type: GraphQLString,
        description: 'slug id of the owning channel'
      },
      channel_position: {
        type: GraphQLInt,
        description: 'the order of the video in the channel (reverse)'
      },
      youtube_id: {
        type: GraphQLString,
        description: 'The Youtube video id'
      },
      time_added: {
        type: GraphQLString,
        description: 'When the video was added to the channel'
      },
      title: {
        type: GraphQLString,
        description: 'The title of the video'
      },
      duration: {
        type: GraphQLInt,
        description: 'Duration of the video in seconds'
      }
    }
    inputOnly: {}
  }

  /**
  graphql types
*/
export const videoType = new graphql.GraphQLObjectType({
  name: 'Video',
  fields: {
    ...videoSchema.fields.readAndInput,
    ...videoSchema.fields.readOnly
  }
})

export const videoInputType = new graphql.GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    ...videoSchema.fields.readAndInput,
    ...videoSchema.fields.inputOnly
  }
})