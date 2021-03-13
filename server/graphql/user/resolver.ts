// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { CookieOptions } from "express";
import { sign } from "jsonwebtoken";

// Internal Imports
import { dateScalar } from "../scalars/date";
import {
  checkPassword,
  createUser,
  deleteUser,
  findUser,
  getAllUsers,
  upateUser,
} from "../../mongoose/controller/user";
import { createDirectory } from "../../mongoose/controller/directory";
import { protectRoute } from "../../mongoose/controller/utils";

// getting environment variables
const SECRET = process.env.PASSWORD_SALT ? process.env.PASSWORD_SALT : "";
const JWTSALT = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
const TOKEN_EXPIRATION_HOURS = Number(
  process.env.TOKEN_EXPIRATION_HOURS ? process.env.TOKEN_EXPIRATION_HOURS : ""
);
const REFRESH_TOKEN_EXPIRATION_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRATION_DAYS
    ? process.env.REFRESH_TOKEN_EXPIRATION_DAYS
    : ""
);
const SERVER_DOMAIN = process.env.SERVER_DOMAIN
  ? process.env.SERVER_DOMAIN
  : "";
const JWT_ALGORITHM: any = process.env.JWT_ALGORITHM
  ? process.env.JWT_ALGORITHM
  : "";

export default {
  Date: dateScalar,
  Query: {
    login: async (_: any, { nick, password }: any, { res }: any) => {
      const now = new Date();
      const maximumExpirationDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS
      );
      let refresh = "";
      let auth = "";

      // check if password if right
      let data = await checkPassword({
        secret: SECRET,
        password: password,
        userToCheck: { nick },
      });

      // if password is right, create JWT's
      if (data && data.allowed) {
        // create authentication token
        auth = sign(
          {
            user: {
              nick: data.user.nick,
            },
            // nbf: now.getTime(),
            iat: now.getTime(),
            exp: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              now.getHours() + TOKEN_EXPIRATION_HOURS
            ).getTime(),
            iss: "localhost",
            sub: "localhost",
          },
          JWTSALT,
          { algorithm: JWT_ALGORITHM }
        );

        // create refresh token
        refresh = sign(
          {
            user: {
              nick: data.user.nick,
            },
            // nbf: now.getTime(),
            iat: now.getTime(),
            exp: maximumExpirationDate.getTime(),
            iss: "localhost",
            sub: "localhost",
          },
          JWTSALT,
          { algorithm: JWT_ALGORITHM }
        );

        // set cookies
        let cookieoOpts: CookieOptions = {
          httpOnly: true,
          // signed: true,
          expires: maximumExpirationDate,
          secure: true,
          sameSite: "strict",
          domain: SERVER_DOMAIN,
        };

        res.cookie("access-token", auth, cookieoOpts);
        res.cookie("refresh-token", refresh, cookieoOpts);
      } else {
        data = {
          allowed: false,
          user: undefined as any,
        };
      }

      return data.user;
    },
    users: async (parent: any, args: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick);

      return getAllUsers();
    },
    user: async (_: any, { nick }: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick);

      return findUser({ nick });
    },
  },
  Mutation: {
    createUser: async (_: any, { data }: any) => {
      // const session = await dbconnection.startSession();
      // session.startTransaction();

      let user: any = await createUser(SECRET, data);

      if (!Array.isArray(user) || user.length <= 0) {
        // await session.abortTransaction();
        // session.endSession();
        throw new UserInputError(`${user}`);
      } else {
        user = user[0];
      }

      // create user's root directory
      let dir: any;
      try {
        dir = await createDirectory({ name: "root", owner: user._id });
      } catch {
        // await session.abortTransaction();
        // session.endSession();

        deleteUser({ id: user._id });

        throw new Error(
          "Some unexpected internal error happen when creating user's directory"
        );
      }

      // // commit changes to db
      // try {
      //   await session.commitTransaction();
      // } catch (error) {
      //   await session.abortTransaction();
      //   session.endSession();
      //   throw error;
      // }

      // session.endSession();
      return user;
    },
    updateUser: async (_: any, { id, data }: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick);

      return upateUser(id, data);
    },
  },
};
