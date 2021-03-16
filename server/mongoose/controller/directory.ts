// Third Party Imports
import { QueryOptions } from "mongoose";

// Internal Imports
import Directory from "../models/directory";
import { DirectoryMetadata, HollowDirectoryMetadata } from "../types/direcotry";
import { rmFiles } from "./file";
import { checkItemEditPerm, touchItem } from "../../utils/controller";
import { arraysEqual, removeItemOnce } from "../../utils/utils";

/**
 * Creates a Directory.
 * @param dir Directory to be added with the minimum information requeried for creation.
 * @param checkPermission In case a permission check must be performed on who is removing the dir. Default: false.
 * @param creator Id of who's creating the dir.
 * @param options mongoose options.
 * @returns Whatever was created of null.
 */
export const createDirectory = async (
  dir: HollowDirectoryMetadata,
  checkPermission = false,
  creator?: string,
  options?: QueryOptions
) => {
  // treating entries
  dir.createdBy = dir.createdBy ? dir.createdBy : dir.owner;
  creator = creator ? creator : dir.owner ? dir.owner : "";
  if (!creator && !dir.createdBy) {
    throw new Error(`The Directory must have a creator or an onwer`);
  }

  // touch father item if there is one
  let father: any;
  if (dir.father) {
    father = await findDirectoryByID(dir.father, options);
    if (!father) {
      throw new Error(
        `Father ${dir.father} in ${dir.name} from ${creator} was not found. This should not be happening.`
      );
    }

    if (!touchItem(creator, father, checkPermission)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }

    // TODO: think about if we should implement this feature
    // check if there is other file or directory with the same name.
    // (father as DirectoryMetadata).directories.filter(value => value.)
  }

  // creating dir and updating father
  let createdDir: any = await Directory.create([dir], options);
  if (!createdDir || createdDir.length <= 0) {
    throw new Error(`Could not craete the directory ${dir.name}`);
  }

  createdDir = createdDir[0];
  if (father) {
    father.directories.push(createdDir._id);
    await father.save();
  }

  return createdDir;
};

/**
 * Find a directory by it's id.
 * @param id ID of the dir to be found, or a list of it.
 * @param options mongoose options.
 * @returns Whatever was found or null, as a object if only a string was given, or as list if a list was given.
 */
export const findDirectoryByID = async (
  id: string | string[],
  options?: QueryOptions
) => {
  if (Array.isArray(id)) {
    return await Directory.find({ _id: id }, undefined, options);
  } else {
    return await Directory.findById(id, undefined, options);
  }
};

// TODO: This function was supposed to return the all removed items.
/**
 * Recursively remove all file tree inside the given directory, including itself.
 * @param id ID of the dir to be found, or a list of it.
 * @param who ID of who us making the change.
 * @param checkPermission In case a permission check must be performed on who is removing the dir. Default: false.
 * @param options Mongoose options.
 * @param touch If the dir's father shall be touched or not. Default true.
 * @returns
 */
export const rmDir = async (
  id: string,
  who: string,
  checkPermission = false,
  options?: QueryOptions,
  touch = true
) => {
  let dir: DirectoryMetadata = await findDirectoryByID(id, options);
  if (!dir) {
    throw new Error(`The directory "${id}" was not found.`);
  }

  // touch father if there's one
  let father: DirectoryMetadata;
  if (touch && dir.father) {
    father = await findDirectoryByID(dir.father, options);
    if (!father) {
      throw new Error(
        `Father ${dir.father} in ${dir.name} was not found. This should not be happening.`
      );
    }

    if (!touchItem(who, father)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }
  }

  // check permission
  if (checkPermission && !checkItemEditPerm(who, dir)) {
    throw new Error("Could not remove file, have you checked permissions?");
  }

  // delete directories' files
  dir.files = rmFiles(dir.files, who, false, options) as any;

  // recursively delete the inner directories
  dir.directories = dir.directories.map((value) =>
    rmDir(value, who, false, options, false)
  ) as any;

  // delete current directory
  await (dir as any).remove(options);

  return dir;
};

/**
 * Update the choosen directory with the given informations
 * @WARNING Does not check special permission, only searching for basic edit permission.
 * @param id ID of the dir to be found, or a list of it.
 * @param who ID of who us making the change.
 * @param newdir The information of the directory to be updated
 * @param checkPermission In case a permission check must be performed on who is removing the dir. Default: false.
 * @param dir The directory to be updated. The Default behavir is this funciton to make this query based on the 'id'.
 * @param options Mongoose options.
 * @param touchDir If the current directory shall be touched or not. Default false.
 * @param touchFather If the dir's father shall be touched or not. Default false.
 * @returns The updated directory after writing to the DB.
 */
export const updateDir = async ({
  id = "",
  who = "",
  newdir,
  checkPermission = false,
  dir,
  options,
  touchDir = false,
  touchFather = false,
  touchDestinationFather = false,
}: {
  id: string;
  who: string;
  newdir: HollowDirectoryMetadata;
  checkPermission?: boolean;
  dir?: DirectoryMetadata;
  options?: QueryOptions;
  touchDir?: boolean;
  touchFather?: boolean;
  touchDestinationFather?: boolean;
}) => {
  // treating entries
  if (touchDestinationFather && !newdir.father) {
    throw new Error(
      `There's no destination father but 'touchDestinationFather' is true.`
    );
  }

  // find and touch current directory if needed
  if (!dir) {
    dir = await findDirectoryByID(id, options);
    if (!dir) {
      throw new Error(`The directory "${id}" was not found.`);
    }
  }

  if (touchDir) {
    if (!touchItem(who, dir, checkPermission)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }
  }

  // find and touch father if there's one
  let father: DirectoryMetadata | undefined = undefined;
  if (touchFather && dir.father) {
    father = await findDirectoryByID(dir.father, options);
    if (!father) {
      throw new Error(
        `Father ${dir.father} in ${dir.name} was not found. This should not be happening.`
      );
    }

    if (!touchItem(who, father, checkPermission)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }
  }

  // find and touch destination father, is needed
  let destFather: DirectoryMetadata | undefined = undefined;
  if (touchDestinationFather) {
    destFather = await findDirectoryByID(
      (newdir as DirectoryMetadata).father,
      options
    );
    if (!destFather) {
      throw new Error(
        `Destination father ${newdir.father} in ${newdir.name} was not found. This should not be happening.`
      );
    }

    if (!touchItem(who, destFather, checkPermission)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }
  }

  // updating info
  dir.directories = newdir.directories ? newdir.directories : dir.directories;
  dir.files = newdir.files ? newdir.files : dir.files;
  dir.name = newdir.name ? newdir.name : dir.name;
  // father
  if (newdir.father && dir.father != newdir.father) {
    moveDir(
      dir,
      destFather ? destFather : (newdir.father as string),
      father,
      options
    );
  }
  dir.owner = newdir.owner ? newdir.owner : dir.owner;

  if (newdir.directories && !arraysEqual(dir.directories, newdir.directories)) {
    dir.directories = newdir.directories;
  }
  if (newdir.files && !arraysEqual(dir.files, newdir.files)) {
    dir.files = newdir.files;
  }

  // check access array
  let isEqual = false;
  if (
    newdir.access &&
    dir.access.length > 0 &&
    newdir.access.length > 0 &&
    dir.access.length === newdir.access.length
  ) {
    for (let index = 0; index < newdir.access.length; index++) {
      if (
        newdir.access[index].accessLevel == dir.access[index].accessLevel &&
        newdir.access[index].user == dir.access[index].user
      ) {
        isEqual = false;
        break;
      }
    }
  }

  if (!isEqual && newdir.access) {
    dir.access = newdir.access;
  }

  // update
  (dir as any).save();
  if (father) {
    (father as any).save();
  }
  if (destFather) {
    (destFather as any).save();
  }

  return dir as any;
};

/**
 * Move 'whatToChange' from 'dirTo' to 'dirFrom'.
 * @param whatToChange Id or Object of the directory whos is being moved.
 * @param dirTo Id or Object of the directory where the item is being moved to.
 * @param dirFrom Id or Object of the directory where the item is being moved from. (can be inferred by 'whatToChange.father')
 * @param options Mongoose options.
 */
const moveDir = async (
  whatToChange: DirectoryMetadata | string,
  dirTo: DirectoryMetadata | string,
  dirFrom?: DirectoryMetadata | string,
  options?: QueryOptions
) => {
  // search for directories if needed
  if (typeof whatToChange === "string") {
    var toChange: DirectoryMetadata = await findDirectoryByID(
      whatToChange,
      options
    );
    if (!whatToChange) {
      throw new Error(`Could find directory ${whatToChange}`);
    }
  } else {
    var toChange = whatToChange;
  }

  if (typeof dirTo === "string") {
    var toDir: DirectoryMetadata = await findDirectoryByID(dirTo, options);
    if (!dirTo) {
      throw new Error(`Could find directory ${dirTo}`);
    }
  } else {
    var toDir = dirTo;
  }

  if (!dirFrom || typeof dirFrom === "string") {
    var formDir: DirectoryMetadata = await findDirectoryByID(
      dirFrom ? dirFrom : toChange.father,
      options
    );
    if (!dirFrom) {
      throw new Error(`Could find directory ${dirFrom}`);
    }
  } else {
    var formDir = dirFrom;
  }

  toChange.father = toDir._id;
  toDir.directories.push(toChange._id);
  formDir.directories = removeItemOnce(formDir.directories, {
    value: toChange._id,
  });
};
