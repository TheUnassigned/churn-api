
import express from 'express'
import graphqlHTTP from 'express-graphql'
import gqlSchema from '../graphql/schema'

const app = express()

app.use('/graphql', graphqlHTTP({
  schema: gqlSchema,
  graphiql: true
}))

app.listen(3000);
