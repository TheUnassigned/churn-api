import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'
import twobyfour from '/config/twobyfour'
import videoType from './video'

const { fields } = videoType.readSchema

const readSchema = {
  name: 'videoCursor',
  description: 'the read type representing a video cursor',
  fields: {
    channel_id: fields.channel_id,
    youtube_id: fields.youtube_id,
    channel_position: fields.channel_position
  }
}

const inputSchema = {
  name: 'videoCursorInput',
  description: 'the input type representing a video cursor',
  fields: {
    channel_id: {
      ...fields.channel_id,
      type: new GraphQLNonNull(fields.channel_id.type)
    },
    youtube_id: {
      ...fields.youtube_id,
      type: new GraphQLNonNull(fields.youtube_id.type)
    },
    channel_position: {
      ...fields.channel_position,
      type: new GraphQLNonNull(fields.channel_position.type)
    }
  }
}

export default {
  readSchema,
  inputSchema,
  read: twobyfour(GraphQLObjectType, readSchema),
  input: twobyfour(GraphQLInputObjectType, inputSchema)
}
