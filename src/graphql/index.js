// Modules
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

// GraphQL configuration
export default new ApolloServer({
  typeDefs,
  resolvers,
  playgound: {
    endpointURL: '/API',
    settings: {
      'editor.theme': 'dark',
    },
  },
});
