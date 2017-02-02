
const isAdmin = (root, args, { viewer }, info) => {
  if(!viewer || !viewer.admin){
    return Promise.reject(new Error('Must have a valid admin token'))
  }
}

const isChannelAdmin = (root, args, context, info) => {
  
}

export {
  isAdmin
}
