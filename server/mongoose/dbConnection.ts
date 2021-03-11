// Third Party Imports
import mongoose from "mongoose";

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;

export let dbconnection: mongoose.Connection;

export const connect = (open?: Function, error?: Function) => {
  // Mongo DB Connetion Establishment
  const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}`;

  mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  dbconnection = mongoose.connection;

  dbconnection.on("error", () => {
    console.error.bind(console, "🔴 Error connecting to Mongo:");
    if (error) {
      error();
    }
  });

  dbconnection.once("open", () => {
    console.log(`🖥  Database connected`);
    if (open) {
      open();
    }
  });

  return dbconnection;
};
