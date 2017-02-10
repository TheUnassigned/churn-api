import twobyfour, { or } from 'twobyfour'

// override of default pre/post keys for twobyfour
export default (type, schema) => twobyfour(type, schema, {
  args: ['validators'],
  pre: ['permissions'],
  post: ['analytics']
})

export {
  or
}
