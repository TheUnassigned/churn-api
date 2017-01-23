import { Types } from 'twobyfour'
import { isLength, matches, isURL } from '../validators'

export default {
  name: 'channelInput',
  input: true,
  fields: {
    slug: {
      type: Types._string,
      description: 'The desired URL slug for the channel',
      required: true,
      validators: [
        isLength(1, 64),
        matches(/^[\w\d]+(?:-[\w\d]+)*$/)
      ]
    },
    title: {
      type: Types._string,
      description: 'The title of the channel',
      validators: [
        isLength(1, 64)
      ]
    },
    blurb: {
      type: Types._string,
      description: 'A blurb explaining what the channel is about',
      validators: [
        isLength(1, 256)
      ]
    },
    logo_url: {
      type: Types._string,
      description: 'The URL of the logo image for the channel',
      validators: [
        isURL()
      ]
    },
    external_url: {
      type: Types._string,
      description: 'The external URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_facebook: {
      type: Types._string,
      description: 'The facebook URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_twitter: {
      type: Types._string,
      description: 'The twitter URL related to the channel',
      validators: [
        isURL()
      ]
    },
    external_instagram: {
      type: Types._string,
      description: 'The instagram URL related to the channel',
      validators: [
        isURL()
      ]
    }
  }
}