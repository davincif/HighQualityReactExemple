// Internal Imports
import { standardFormat, timeNow } from "../../utils/times";
import { HollowDirectoryMetadata } from "../types/direcotry";
import { HollowFileMetadata } from "../types/file";
import { validaccessLevels } from "../types/permissions";

/**
 * Update the information about last modification in the file, checking if the requested user has permission to do so.
 * @param who The id of the user who is modifying the item.
 * @param item The item being modifying.
 * @returns true or false weather the operations worked or not.
 */
export const touchItem = (
  who: string,
  item: HollowDirectoryMetadata | HollowFileMetadata
) => {
  // checking for permission
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

  // touching
  item.modifiedAt = standardFormat(timeNow());
  item.modifiedBy = who;

  return true;
};
