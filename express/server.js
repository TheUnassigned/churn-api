
import express from 'express'
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import jwt from 'express-jwt'
import AWS from 'aws-sdk'
import DB from '/dynamodb'
import schema from '/model'

// setup aws
AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'
});
// init the database client
DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }))

const app = express()

app.use(jwt({
  secret: 'raaaaasd-secret',
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
}));

app.listen(3000, () => console.log('Churn API listening on port 3000'));
