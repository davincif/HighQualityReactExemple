import User from "../../models/user";

export default {
  Query: {
    users: () => User.find(),
    user: (_: any, { id }: any) => User.findById(id),
  },
  Mutation: {
    createUser: (_: any, { data }: any) => User.create(data),
    updateUser: (_: any, { id, data }: any) =>
      User.findOneAndUpdate(id, data, { new: true }),
  },
};
