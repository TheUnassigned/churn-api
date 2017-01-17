
import graphql, { GraphQLString } from 'graphql'

/**
  abstract schema structure for channels
*/
export const channelSchema = {
  fields: {
    readAndInput: {
      slug: { 
        type: GraphQLString,
        description: 'URL slug for the channel and primary id',
      },
      admin_key: { 
        type: GraphQLString,
        description: 'Master key for the channel which is validated when trying to alter the channel or add videos' 
      },
      video_add_key: {
        type: GraphQLString,
        description: 'Extra key for video add access only'
      },
      title: {
       type: GraphQLString,
       description: 'Title of the channel'
      },
      blurb: { 
        type: GraphQLString,
        description: 'Text block description of what the channel is about' 
      },
      logo_url: {
        type: GraphQLString,
        description: 'URL of the logo used to promote the channel'
      },
      external_url: {
        type: GraphQLString,
        description: 'URL of site the channel is references from if applicable'
      },
      external_facebook: {
        type: GraphQLString,
        description: 'URL of facebook page related to the channel'
      },
      external_twitter: {
        type: GraphQLString,
        description: 'URL of twitter user related to the channel'
      }
    },
    readOnly: {
      //recent_videos: { type: GraphQLList}
    },
    inputOnly: {}
  }
  
}

/**
  graphql types
*/
export const channelType = new graphql.GraphQLObjectType({
  name: 'Channel',
  fields: {
    ...channelSchema.fields.readAndInput,
    ...channelSchema.fields.readOnly
  }
})

export const channelInputType = new graphql.GraphQLInputObjectType({
  name: 'ChannelInput',
  fields: {
    ...channelSchema.fields.readAndInput,
    ...channelSchema.fields.inputOnly
  }
})