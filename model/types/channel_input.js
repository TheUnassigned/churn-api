import { Types } from '../../twobyfour'
import { isLength, matches, isURL } from '../validators'

export default {
  name: 'channelInput',
  input: true,
  fields: {
    slug: {
      type: Types.String,
      description: 'The desired URL slug for the channel',
      required: true,
      validators: [
        isLength(1, 64),
        matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
      ]
    },
    title: {
      type: Types.String,
      description: 'The title of the channel',
      required: true,
      validators: [
        isLength(1, 64)
      ]
    },
    blurb: {
      type: Types.String,
      description: 'A blurb explaining what the channel is about',
      validators: [
        isLength(1, 256)
      ]
    },
    logo_url: {
      type: Types.String,
      description: 'The URL of the logo image for the channel',
      required: true,
      validators: [
        isURL()
      ]
    },
    external_url: {
      type: Types.String,
      description: 'The external URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_facebook: {
      type: Types.String,
      description: 'The facebook URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_twitter: {
      type: Types.String,
      description: 'The twitter URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_instagram: {
      type: Types.String,
      description: 'The instagram URL related to the channel',
      validators: [
        isURL()
      ]
    }
  }
}