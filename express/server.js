
import express from 'express'
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import jwt from 'express-jwt'
import AWS from 'aws-sdk'
import DB from '/dynamodb'
import schema from '/model'
import { config } from '/config/environment'

// setup aws
AWS.config.update({
  accessKeyId: config.AWS_ID,
  secretAccessKey: config.AWS_KEY,
  region: config.AWS_REGION
});
// init the database client
DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: config.AWS_REGION }))

const app = express()

app.use(jwt({
  secret: config.JWT_SECRET,
  credentialsRequired: false
}))

app.use('/graphql', bodyParser.json(), graphqlExpress(req => ({
  schema,
  context: {
    DB,
    viewer: req.user
  },
  formatError: error => ({
    message: error.message,
    details: error.stack
  }),
  debug: true
})))

// graphiql page
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  passHeader: config.GRAPHIQL_HEADER
}))

app.listen(config.PORT, () => console.log(`Churn API listening on port ${config.PORT}`))
