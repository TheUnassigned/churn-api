import { graphql } from 'graphql'
import AWS from 'aws-sdk'
import schema from '/model'
import DB from '/dynamodb'
import { getJWT } from '/auth'
import { config } from '/config/environment'

DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: config.AWS_REGION }))

const api = (event, context, callback) => {

  // headers used to deal with cors
  const headers = {
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Origin' : event.headers.origin, // CORS :()
    'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HTTPS
    'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type, Authorization'
  }

  // handle options preflight for posts
  if(event.httpMethod === 'OPTIONS') {
    const response = {
      headers,
      statusCode: 200,
    }
    return callback(null, response)
  }

  // attempt to get jwt
  getJWT(event.headers.Authorization, config.JWT_SECRET).then(viewer => {
    const request = event.httpMethod === 'POST' ?
      JSON.parse(event.body) :
      event.queryStringParameters

    graphql(schema, request.query, {}, { DB, viewer }, request.variables).then(result => {
      console.log(result)
      const response = {
        headers,
        statusCode: 200,
        body: JSON.stringify(result)
      }
      callback(null, response)
    })
  }).catch(err => {
    console.log(err)
    const response = {
      headers,
      statusCode: 500,
      body: JSON.stringify({
        error: err
      })
    }
    callback(null, response)
  })
}

export {
  api
}
