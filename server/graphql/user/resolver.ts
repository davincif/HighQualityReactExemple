// Third Party Imports
import { UserInputError } from "apollo-server-express";
import { CookieOptions } from "express";
import { sign } from "jsonwebtoken";

// Internal Imports
import {
  checkPassword,
  createUser,
  findUser,
  getAllUsers,
  upateUser,
} from "../../mongoose/controller/user";
import { dateScalar } from "../scalars/date";

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
      let allowed = false;
      let user;
      if (data) {
        allowed = data.allowed;
        user = data.user;
      }

      // if password is right, create JWT's
      if (allowed) {
        // create authentication token
        auth = sign(
          {
            user: {},
            nbf: now.getTime(),
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
            user: {},
            nbf: now.getTime(),
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
        user = undefined;
      }

      return user;
    },
    users: () => getAllUsers(),
    user: (_: any, { nick }: any) => findUser({ nick }),
    // user: (_: any, { id }: any) => User.findById(id),
  },
  Mutation: {
    createUser: async (_: any, { data }: any) => {
      let user = await createUser(SECRET, data);

      if (typeof user === "string") {
        throw new UserInputError(user);
      }

      return user;
    },
    updateUser: (_: any, { id, data }: any) => upateUser(id, data),
  },
};
