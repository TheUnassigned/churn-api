
import express from 'express'
import jwt from 'express-jwt'
import graphqlHTTP from 'express-graphql'
import AWS from 'aws-sdk'
import twobyfour from 'twobyfour'
import DB from 'twobyfour/src/db/dynamodb'
import model from '../model'

// setup aws
AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'
});
// init the database client
DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }))

// build the twobyfour. schema
const schema = twobyfour(model)

const app = express()

app.use(jwt({
  secret: 'raaaaasd-secret',
  credentialsRequired: false
}))

app.use('/graphql', graphqlHTTP(req => ({
  schema,
  graphiql: true,
  pretty: true,
  context: {
    DB,
    token: req.user
  }
})))

app.listen(3000, () => console.log('Churn API listening on port 3000'));
