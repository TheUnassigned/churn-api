import jwt from 'jsonwebtoken'

/**
 * given an optional auth Bearer token attempt
 * to verify and decode using provided secret
 */
const getJWT = (authToken, secret) => {
  if(!authToken){ return null }

  const token = authToken.split(' ')
  if(!token[0] === 'Bearer'){ return null }

  return new Promise((resolve, reject) => {
    jwt.verify(token[1], secret, (err, decoded) => {
      if(err){ resolve() }
      resolve(decoded)
    })
  })
}

export {
  getJWT
}