import { graphql } from 'graphql'
import AWS from 'aws-sdk'
import schema from '/model'
import { getJWT } from '/auth'
import { config } from '/config/environment'

const DB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

const api = (event, context, callback) => {

  // attempt to get jwt
  getJWT(event.authorizationToken, config.JWT_SECRET).then(viewer => {

    // TODO: handle actual input params rather than static demo
    console.log(event)

    graphql(schema, '{ hello }', { DB, viewer }).then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
      callback(null, response)
    })
  })
}

export {
  api
}
