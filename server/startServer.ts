// Standard Libs
import * as path from "path";

// Third Party Imports
import * as dotenv from "dotenv";
// loading environment variables
dotenv.config({ path: path.join(__dirname, ".env.dev") });
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";

// Internal Imports
import { connect } from "./mongoose/dbConnection";

const APOLLO_PORT = process.env.APOLLO_PORT;
// const MONGO_DATABASE = "familly_bugget";
const JWTSALT = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

const startServer = ({ typeDefs, resolvers }: any) => {
  // Mongo DB Connetion Establishment
  connect();

  // Creating Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      const accessToken = req.cookies["access-token"];
      const refreshToken = req.cookies["refresh-token"];

      if (accessToken) {
        try {
          const data = verify(accessToken, JWTSALT) as any;
          (req as any).nick = data.user.nick;
        } catch (error) {
          // console.error(error);
        }
      }

      if (refreshToken) {
        try {
          (req as any).refreshToken = refreshToken;
        } catch (error) {
          // console.error(error);
        }
      }

      return { req, res };
    },
    tracing: true,
    debug: true,
    playground: true,
  });

  // Opening Express Server
  const app = express();

  app.use(cookieParser());

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
