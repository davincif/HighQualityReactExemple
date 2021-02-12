// Standard Libs
import * as path from "path";

// Third Party Imports
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server";
import * as dotenv from "dotenv";

// loading environment variables
dotenv.config({ path: path.join(__dirname, ".env.dev") });

const APOLLO_PORT = process.env.APOLLO_PORT;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
// const MONGO_DATABASE = "familly_bugget";

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
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      // { req, res, connection }
      // console.log("req.headers.authorization", req.headers.authorization);
      // console.log("res.cookie", res.cookie);

      return { res };
      // return { cookie: () => {} };
    },
  });
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
