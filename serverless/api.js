import { graphql } from 'graphql'
import AWS from 'aws-sdk'
import schema from 'model'
import { getJWT } from 'auth'
import { config } from 'config/environment'

const DB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

export const api = (event, context, callback) => {

  // attempt to get jwt
  getJWT(event.authorizationToken, config.JWT_SECRET).then(token => {

    // TODO: handle actual input params rather than static demo

    graphql(schema, '{ hello }', { DB, token }).then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
      callback(null, response)
    })
  })
}
