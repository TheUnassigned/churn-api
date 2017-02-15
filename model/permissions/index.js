
/**
 * Checks whether or not the token has a valid admin key
 */
const isAdmin = (root, args, { viewer }, info) => {
  if(!viewer || !viewer.admin){
    return Promise.reject(new Error('Must have a valid admin token'))
  }
}

const isChannelAdmin = slugFunc => (root, args, { viewer }, info) => {
  const slug = slugFunc(args)
  if(!viewer || !viewer[slug]){
    return Promise.reject(new Error('Must have channel admin access'))
  }
}

export {
  isAdmin,
  isChannelAdmin
}
