import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import queries from './queries'
import mutations from './mutations'
import twobyfour from 'twobyfour'

export default twobyfour(new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Root query type',
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation type',
    fields: mutations
  })
}), {
  args: ['validators'],
  pre: ['permissions'],
  post: ['analytics']
})
