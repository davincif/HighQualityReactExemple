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

/**
 * Creates an user.
 * @param secret Secret to encode password.
 * @param data The user's data to be created.
 * @param options mongoose save options.
 * @returns Whatever was created of null.
 */
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

/**
 * Updates an user.
 * @param id ID of the user to be found.
 * @param upUser The user's data to be updated.
 * @returns The updated user or null if it was not found.
 */
export const upateUser = async (id: any, upUser: HollowUserMetadata) =>
  User.findOneAndUpdate(id, upUser, { new: true });

/**
 * Check if the given password matches with the given user's password.
 * @param secret Secret to encode password.
 * @param password User's password.
 * @param userToCheck The user to be check.
 * @returns True or false whether if the password matches or not.
 */
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

/**
 * Find an user by it's id or nick.
 * @param nick The user's nick. Either this or 'id' must be present.
 * @param id The user's id. Either this or 'nick' must be present.
 * @param options mongoose options
 * @returns the user, or null if not found.
 */
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

/**
 * Deletes an user.
 * @param nick The user's nick. Either this or 'id' must be present.
 * @param id The user's id. Either this or 'nick' must be present.
 * @param options mongoose options
 * @returns whatever was deleted, or undefined
 */
export const deleteUser = async (
  { id, nick }: { id?: string; nick?: string },
  options?: QueryOptions
) => {
  if (!id && !nick) {
    throw new Error("There must be the id or the nick to delete an user");
  }

  return await User.deleteOne({ id, nick }, options);
};
