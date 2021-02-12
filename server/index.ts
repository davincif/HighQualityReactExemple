// Internal Imports
import startServer from "./startServer";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

// starting server
startServer({ typeDefs, resolvers });
