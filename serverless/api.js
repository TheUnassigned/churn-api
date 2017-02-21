import { graphql } from 'graphql'
import AWS from 'aws-sdk'
import schema from '/model'
import DB from '/dynamodb'
import { getJWT } from '/auth'
import { config } from '/config/environment'

DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: config.AWS_REGION }))

const api = (event, context, callback) => {

  // attempt to get jwt
  getJWT(event.authorizationToken, config.JWT_SECRET).then(viewer => {
    console.log(event)
    const request = event.httpMethod === 'POST' ? event.body : event.query

    graphql(schema, request, {}, { DB, viewer }).then(result => {
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
