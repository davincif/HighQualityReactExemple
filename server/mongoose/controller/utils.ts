// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";

// Internal Imports
import { standardFormat, timeNow } from "../../utils/times";
import { HollowDirectoryMetadata } from "../types/direcotry";
import { HollowFileMetadata } from "../types/file";
import { validaccessLevels } from "../types/permissions";
import { findUser } from "./user";

/**
 * Update the information about last modification in the file, checking if the requested user has permission to do so.
 * @param who The id of the user who is modifying the item.
 * @param item The item being modifying.
 * @param checkPermission Perform a permission check, default false.
 * @returns true or false weather the operations worked or not.
 */
export const touchItem = (
  who: string,
  item: HollowDirectoryMetadata | HollowFileMetadata,
  checkPermission?: boolean
) => {
  // checking for permission
  if (checkPermission && !checkItemEditPerm(who, item)) {
    return false;
  }

  // touching
  item.modifiedAt = standardFormat(timeNow());
  item.modifiedBy = who;

  return true;
};

/**
 * Check Item Edit Permission.
 * @param who The id of the user who must have edit permission.
 * @param item The item being modifying.
 * @returns true if the user has edit permissions, false otherwise.
 */
export const checkItemEditPerm = (
  who: string,
  item: HollowDirectoryMetadata | HollowFileMetadata
) => {
  if (who && `${who}` != `${item.owner}`) {
    let found = item.access?.filter(
      (value) =>
        value.user == who &&
        validaccessLevels.splice(0, -1).includes(value.accessLevel)
    );

    if (found && found.length <= 0) {
      // this user doesnt has permission to touch this item
      return false;
    }
  }

  return true;
};

/**
 * Throws if an user, for wathever reason, must not be allowed to access a protected route.
 * @param nick The nick of the user who's trying to access the route.
 * @param allowGuest If guests are allowed to acess the rule protected by this function.
 * @returns the user's object in success case.
 */
export const protectRoute = async (nick: string, allowGuest = false) => {
  if (!nick) {
    throw new AuthenticationError("not loged");
  }

  // check if owner exists and get it's ID
  let owner = await findUser({ nick });
  if (!(owner && owner.active)) {
    // the user doesn't exist or is inactive
    throw new UserInputError(`${nick} is not a valid user`);
  }

  return owner;
};

/**
 * Remove all duplicated entries from a Array
 * @param vect Vector to be converted.
 * @return A new vector with unique entries.
 */
export const removeDuplicated = (vect: any[]): any[] => {
  const set = new Set(vect);

  return [...set];
};
