// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";

// Internal Imports
import { timeNow } from "./times";
import { HollowDirectoryMetadata } from "../mongoose/types/direcotry";
import { HollowFileMetadata } from "../mongoose/types/file";
import { AccessLevel, validaccessLevels } from "../mongoose/types/permissions";
import { findUser } from "../mongoose/controller/user";

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
  checkPermission = false
) => {
  // checking for permission
  if (checkPermission && !checkItemEditPerm(who, item)) {
    return false;
  }

  // touching
  item.modifiedAt = timeNow();
  item.modifiedBy = who;

  return true;
};

/**
 * Check Item Edit Permission.
 * @param who The id of the user who must have edit permission.
 * @param item The item being modifying.
 * @param leastPermission The lesser access level required. Default is "EDITOR".
 * @returns true if the user has edit permissions, false otherwise.
 */
export const checkItemEditPerm = (
  who: string,
  item: HollowDirectoryMetadata | HollowFileMetadata,
  leastPermission: AccessLevel = "EDITOR"
) => {
  if (who && `${who}` != `${item.owner}`) {
    let lastPermIdx = validaccessLevels.indexOf(leastPermission);
    let allowedLevels = validaccessLevels.splice(0, lastPermIdx + 1);
    let found = item.access?.filter(
      (value) => value.user == who && allowedLevels.includes(value.accessLevel)
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
