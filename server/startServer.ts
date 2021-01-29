// https://www.apollographql.com/docs/apollo-server/api/graphql-tools/
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server";

const APOLLO_PORT = 4000;
const MONGO_USER = "fbroot";
const MONGO_PASS = "fbmongopass";
const MONGO_HOST = "localhost";
const MONGO_PORT = "27017";
const MONGO_DATABASE = "familly_bugget";

const startServer = ({ typeDefs, resolvers }: any) => {
  // Mongo DB Connetion Establishment
  const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}`;
  console.log("mongo_url", mongo_url);
  mongoose.connect(mongo_url, {
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
    .listen({ port: APOLLO_PORT })
    .then(({ url }) => {
      console.log(`⚡ Server started at ${url}`);
    })
    .catch((err) => {
      console.log(`💥 Some catastrophic error happened: ${err}`);
    });
};

export default startServer;
