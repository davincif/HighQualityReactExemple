// Standard Libs
import * as path from "path";

// Third Party Imports
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";

// loading environment variables
dotenv.config({ path: path.join(__dirname, ".env.dev") });

const APOLLO_PORT = process.env.APOLLO_PORT;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
// const MONGO_DATABASE = "familly_bugget";
const JWTSALT = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

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

  // Creating Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      // console.log("req.headers.authorization", req.headers.authorization);
      // console.log("res.cookie", res.cookie);

      return { req, res };
    },
    debug: true,
    playground: true,
  });

  // Opening Express Server
  const app = express();

  app.use(cookieParser());
  app.use((req, _, next) => {
    const accessToken = req.cookies["access-token"];
    console.log("accessToken", accessToken);

    try {
      const data = verify(accessToken, JWTSALT) as any;
      console.log("data", data);
      (req as any).userId = data.userId;
    } catch {
      console.log("not valid token");
    }

    next();
  });

  // Add Express as Middeware for Apollo
  server.applyMiddleware({ app });

  // Opening Express Server Listener
  app
    .listen({ port: APOLLO_PORT }, () => {
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      );
    })
    .on("error", (err) => {
      console.log(`💥 Some catastrophic error happened: ${err.message}`);
      console.error(err);
    });
};

export default startServer;
