
import { graphql } from 'graphql'
import DB from 'DB'
import schema from 'graphql/schema'

export const api = (event, context, callback) => {

	graphql(schema, '{ hello }', { DB }).then(result => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(event)
    }
    callback(null, response)
  })
}
