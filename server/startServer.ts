// https://www.apollographql.com/docs/apollo-server/api/graphql-tools/
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server";

const PORT = 4000;

const startServer = ({ typeDefs, resolvers }: any) => {
  // Mongo DB Connetion Establishment
  mongoose.connect("mongodb://localhost:27017/graphql", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "🔴 Error connecting to Mongo:"));
  db.once("open", function () {
    console.log(`🖥  Database connected`);
  });

  // Opening Listener to Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });
  server
    .listen({ port: PORT })
    .then(({ url }) => {
      console.log(`⚡ Server started at ${url}`);
    })
    .catch((err) => {
      console.log(`💥 Some catastrophic error happened: ${err}`);
    });
};

export default startServer;
