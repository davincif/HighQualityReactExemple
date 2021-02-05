import { UserInputError } from "apollo-server";
import {
  checkPassword,
  createUser,
  findUser,
  getAllUsers,
  upateUser,
} from "../../mongoose/controller/user";
import { dateScalar } from "../scalars/date";

const secret = "fbslat";

export default {
  Date: dateScalar,
  Query: {
    login: async (_: any, { nick, password }: any) =>
      !!(await checkPassword({
        secret: secret,
        password: password,
        userToCheck: { nick },
      })),
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
