
import { graphql } from 'graphql'
import schema from '../graphql/schema'

export const api = (event, context, callback) => {
  
  graphql(schema, '{ hello }').then(result => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }
    callback(null, response)
  })
}
