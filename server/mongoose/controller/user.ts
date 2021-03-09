// Node Imports
import crypto from "crypto";

// External lib Imports
import { Document } from "mongoose";

// Local Imports
import User from "../models/user";
import {
  HollowUserMetadata,
  UserMetadata,
  validAcessLevels,
} from "../types/user";

export const getAllUsers = () => User.find();

export const createUser = async (secret: string, data: UserMetadata) => {
  data.password = crypto
    .createHmac("sha512", secret)
    .update(data.password)
    .digest("hex");

  // check if the given acess level is valid
  if (!validAcessLevels.includes(data.accessLevel)) {
    return `Acess Level '${data.accessLevel}' is not valid, possibles are '${validAcessLevels}'`;
  }

  // create object on DB
  console.log("// create object on DB");
  return await User.create(data);
};

export const upateUser = async (id: any, upUser: HollowUserMetadata) =>
  User.findOneAndUpdate(id, upUser, { new: true });

export const checkPassword = async ({
  secret,
  password,
  userToCheck,
}: {
  secret: string;
  password: string;
  userToCheck: HollowUserMetadata;
}) => {
  let user: Document<any> | null = null;
  if (!userToCheck.password) {
    if (!userToCheck._id && !userToCheck.nick) {
      throw new Error(
        "userToCheck must have '_id' or 'nick' field if 'password' is not present"
      );
    }
    user = await findUser({ _id: userToCheck._id, nick: userToCheck.nick });
    if (user) {
      userToCheck.password = (user as any).password;
    } else {
      return;
    }

    password = crypto
      .createHmac("sha512", secret)
      .update(password)
      .digest("hex");
    return { allowed: password == userToCheck.password, user: user };
  }
};

export const findUser = async ({
  _id,
  nick,
}: {
  _id?: string;
  nick?: string;
}) => {
  if (!_id && !nick) {
    throw new Error("There must be the id or the nick to search an user");
  }

  if (_id) {
    return await User.findById({ id: _id });
  } else if (nick) {
    return await User.findOne({ nick: nick });
  } else {
    return null;
  }
};
