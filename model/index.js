import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import queries from './queries'
import mutations from './mutations'
import twobyfour from '/config/twobyfour'

export default new GraphQLSchema({
  query: twobyfour(GraphQLObjectType, {
    name: 'Query',
    description: 'Root query type',
    fields: queries
  }),
  mutation: twobyfour(GraphQLObjectType, {
    name: 'Mutation',
    description: 'Root mutation type',
    fields: mutations
  })
})
