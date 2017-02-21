// simply graphiql client used to interact with the serverless deployment
import express from 'express'
import { graphiqlExpress } from 'graphql-server-express'
import { config } from '/config/environment'

const app = express()

// graphiql page
app.use('/graphiql', graphiqlExpress({
  endpointURL: config.LAMBDA_ENDPOINT_DEV,
  passHeader: config.GRAPHIQL_HEADER
}))

app.listen(config.PORT, () => console.log(`Churn API graphiql client listening on port ${config.PORT}`));
