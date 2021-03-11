// Node Imports
import crypto from "crypto";
import { QueryOptions, SaveOptions } from "mongoose";

// External lib Imports

// Local Imports
import User from "../models/user";
import {
  HollowUserMetadata,
  UserMetadata,
  // validaccessLevels,
} from "../types/user";

export const getAllUsers = () => User.find();

export const createUser = async (
  secret: string,
  data: UserMetadata,
  options?: SaveOptions
) => {
  data.password = crypto
    .createHmac("sha512", secret)
    .update(data.password)
    .digest("hex");

  // // check if the given access level is valid
  // if (!validaccessLevels.includes(data.accessLevel)) {
  //   return `access Level '${data.accessLevel}' is not valid, possibles are '${validaccessLevels}'`;
  // }

  // create object on DB
  return await User.create([data], options);
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
  let user: any = null;
  if (!userToCheck.password) {
    if (!userToCheck._id && !userToCheck.nick) {
      throw new Error(
        "userToCheck must have 'id' or 'nick' field if 'password' is not present"
      );
    }
    user = await findUser({ id: userToCheck._id, nick: userToCheck.nick });
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

export const findUser = async (
  { id, nick }: { id?: string; nick?: string },
  options?: QueryOptions
) => {
  if (!id && !nick) {
    throw new Error("There must be the id or the nick to search an user");
  }

  if (id) {
    return await User.findById({ id: id }, undefined, options);
  } else if (nick) {
    return await User.findOne({ nick: nick }, undefined, options);
  } else {
    return null;
  }
};

export const deleteUser = async (
  { id, nick }: { id?: string; nick?: string },
  options?: QueryOptions
) => {
  if (!id && !nick) {
    throw new Error("There must be the id or the nick to delete an user");
  }

  return await User.deleteOne({ id, nick }, options);
};
