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
    createUser: (_: any, { data }: any) => createUser(secret, data),
    updateUser: (_: any, { id, data }: any) => upateUser(id, data),
  },
};
