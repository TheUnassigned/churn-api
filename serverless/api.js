import { graphql } from 'graphql'
import AWS from 'aws-sdk'
import twobyfour from 'twobyfour'
import model from 'model'
import { getJWT } from 'auth'

const DB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
const schema = twobyfour(model)

export const api = (event, context, callback) => {

  // attempt to get jwt
  getJWT(event.authorizationToken, 'maaah secret').then(token => {

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
