
const isAdmin = (key, str, { token }) => {
  if(!token || !token.admin){
    return Promise.reject(new Error('Must have a valid admin token.'))
  }
}

export {
  isAdmin
}