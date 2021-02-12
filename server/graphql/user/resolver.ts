// Third Party Imports
import { UserInputError } from "apollo-server";
import { CookieOptions } from "express";
import jwt from "jsonwebtoken";

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
const secret = process.env.PASSWORD_SALT ? process.env.PASSWORD_SALT : "";
const jwtsalt = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
const tokenExpirationHours = Number(
  process.env.TOKEN_EXPIRATION_HOURS ? process.env.TOKEN_EXPIRATION_HOURS : ""
);
const refreshTokenExpirationDays = Number(
  process.env.REFRESH_TOKEN_EXPIRATION_DAYS
    ? process.env.REFRESH_TOKEN_EXPIRATION_DAYS
    : ""
);
const serverDomain = process.env.SERVER_DOMAIN ? process.env.SERVER_DOMAIN : "";
const jwtAlgorithm: any = process.env.JWT_ALGORITHM
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
        now.getDate() + refreshTokenExpirationDays
      );
      let refresh = "";
      let auth = "";

      // check if password if right
      let allowed = !!(await checkPassword({
        secret: secret,
        password: password,
        userToCheck: { nick },
      }));

      // if password is right, create JWT's
      if (allowed) {
        // create authentication token
        auth = jwt.sign(
          {
            user: {},
            nbf: now.getTime(),
            iat: now.getTime(),
            exp: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              now.getHours() + tokenExpirationHours
            ).getTime(),
            iss: "localhost",
            sub: "localhost",
          },
          jwtsalt,
          { algorithm: jwtAlgorithm }
        );

        // create refresh token
        refresh = jwt.sign(
          {
            user: {},
            nbf: now.getTime(),
            iat: now.getTime(),
            exp: maximumExpirationDate.getTime(),
            iss: "localhost",
            sub: "localhost",
          },
          jwtsalt,
          { algorithm: jwtAlgorithm }
        );

        // set cookies
        let cookieoOpts: CookieOptions = {
          httpOnly: true,
          // signed: true,
          expires: maximumExpirationDate,
          secure: true,
          sameSite: "strict",
          domain: serverDomain,
        };
        res.cookie("authToken", auth, cookieoOpts);
        res.cookie("refreshToken", refresh, cookieoOpts);
      }

      return { allowed, refresh, auth };
    },
    users: () => getAllUsers(),
    user: (_: any, { nick }: any) => findUser({ nick }),
    // user: (_: any, { id }: any) => User.findById(id),
  },
  Mutation: {
    createUser: async (_: any, { data }: any) => {
      let user = await createUser(secret, data);

      if (typeof user === "string") {
        throw new UserInputError(user);
      }

      return user;
    },
    updateUser: (_: any, { id, data }: any) => upateUser(id, data),
  },
};
