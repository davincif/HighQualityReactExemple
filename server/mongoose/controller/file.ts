// Third Party Imports
import { QueryOptions } from "mongoose";

// Internal Imports
import File from "../models/files";
import { DirectoryMetadata } from "../types/direcotry";
import { FileMetadata, HollowFileMetadata } from "../types/file";
import { findDirectoryByID } from "./directory";
import { touchItem } from "../../utils/controller";
import { removeDuplicated, removeItemOnce } from "../../utils/utils";

/**
 * Creates a File.
 * @param file File to be added with the minimum information requeried for creation.
 * @param checkPermission Whether if permission check shall not be performed. Default: false.
 * @param creator Id of who's creating the file.
 * @param options mongoose options.
 * @returns Whatever was created of null.
 */
export const createFile = async (
  file: HollowFileMetadata,
  checkPermission = false,
  creator?: string,
  options?: QueryOptions
) => {
  // treating entries
  file.createdBy = file.createdBy ? file.createdBy : file.owner;
  creator = creator ? creator : file.owner ? file.owner : "";
  if (!creator && !file.createdBy) {
    throw new Error(`The File must have a creator or an onwer.`);
  }
  if (!file.father) {
    throw new Error(`The File must have a father.`);
  }

  // touch father item
  let father: any = await findDirectoryByID(file.father, options);
  if (!father) {
    throw new Error(
      `Father ${file.father} in ${file.name} from ${creator} was not found. This should not be happening.`
    );
  }

  if (!touchItem(creator, father, checkPermission)) {
    throw new Error("Could not touch file, have you checked permissions?");
  }

  // TODO: think about if we should implement this feature
  // check if there is other file or directory with the same name.

  // creating file and updating father
  let createdFile: any = await File.create([file], options);
  if (!createdFile || createdFile.length <= 0) {
    throw new Error(`Could not craete the directory ${file.name}.`);
  }

  createdFile = createdFile[0];
  father.files.push(createdFile._id);
  await father.save();

  return createdFile;
};

/**
 * Find a file by it's id.
 * @param id ID of the file to be found, or a list of it.
 * @param options mongoose options.
 * @returns Whatever was found or null, as a object if only a string was given, or as list if a list was given.
 */
export const findFileByID = async (
  id: string | string[],
  options?: QueryOptions
) => {
  if (Array.isArray(id)) {
    return await File.find({ _id: id }, undefined, options);
  } else {
    return await File.findById(id, undefined, options);
  }
};

/**
 * Perform a deletion of the requested file in name of 'who'.
 * @param id Id of the file to be removed.
 * @param who Who is performing this action.
 * @param checkPermission In case a permission check must be performed on who is removing the file. Default: false.
 * @param options mongoose options.
 * @returns whatever was removed, or undefined
 */
export const rmFile = async (
  id: string,
  who: string,
  checkPermission = false,
  options?: QueryOptions
) => {
  // find file
  let file = await findFileByID(id, options);
  if (!file) {
    throw new Error(`file ${id} not found`);
  }

  // touch father file
  let father = await findDirectoryByID(file.father, options);
  if (!father) {
    throw new Error(
      `Father ${file.father} in ${file.name} from ${who} was not found. This should not be happening.`
    );
  }

  if (!touchItem(who, file.father, checkPermission)) {
    throw new Error("Could not touch file, have you checked permissions?");
  }

  // remove file from father's list
  father.files = (father as DirectoryMetadata).files.filter(
    (item) => `${item}` !== `${id}`
  );
  await (father as any).save();

  // remove file
  await file.remove(options);

  return file;
};

/**
 * Perform a deletion of the requested files in name of 'who'.
 * @param id Lis of IDs of the file to be removed.
 * @param who Who is performing this action.
 * @param checkPermission In case a permission check must be performed on who is removing the file. Default: false.
 * @param options mongoose options.
 * @returns whatever was removed, or undefined
 */
export const rmFiles = async (
  id: string[],
  who: string,
  checkPermission = false,
  options?: QueryOptions
) => {
  // query all files
  let files: FileMetadata[] = await findFileByID(id, options);
  if (!files || files.length <= 0) {
    throw new Error(`file ${id} not found`);
  }

  // query all fathers involved
  let fathersToQuery = removeDuplicated(files.map((value) => value.father));
  let fathers: DirectoryMetadata[] = await findDirectoryByID(fathersToQuery);

  // touch all fathers
  for (let father of fathers) {
    if (!touchItem(who, father, checkPermission)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }
  }

  // remove file from all fathers' list
  for (let father of fathers) {
    father.files = (father as DirectoryMetadata).files.filter(
      (item) => `${item}` !== `${id}`
    );
  }
  let promises = fathers.map((value) => (value as any).save());
  await Promise.all(promises);

  // remove file
  promises = files.map((value) => (value as any).remove(options));
  await Promise.all(promises);

  return files;
};

/**
 * Update the choosen directory with the given informations
 * @WARNING Does not check special permission, only searching for basic edit permission.
 * @param id ID of the dir to be found, or a list of it.
 * @param who ID of who us making the change.
 * @param newdir The information of the directory to be updated
 * @param checkPermission In case a permission check must be performed on who is removing the file. Default: false.
 * @param dir The directory to be updated. The Default behavir is this funciton to make this query based on the 'id'.
 * @param options Mongoose options.
 * @param touchDir If the current directory shall be touched or not. Default false.
 * @param touchFather If the dir's father shall be touched or not. Default false.
 * @returns The updated directory after writing to the DB.
 */
export const updateFile = async ({
  id = "",
  who = "",
  newfile,
  checkPermission = false,
  file,
  touchFile = false,
  options,
  touchFather = false,
  touchDestinationFather = false,
}: {
  id: string;
  who: string;
  newfile: HollowFileMetadata;
  checkPermission?: boolean;
  file?: FileMetadata;
  touchFile?: boolean;
  options?: QueryOptions;
  touchFather?: boolean;
  touchDestinationFather?: boolean;
}) => {
  // treating entries
  if (touchDestinationFather && !newfile.father) {
    throw new Error(
      `There's no destination father but 'touchDestinationFather' is true.`
    );
  }

  // find and touch current directory if needed
  if (!file) {
    file = await findFileByID(id, options);
    if (!file) {
      throw new Error(`The directory "${id}" was not found.`);
    }
  }

  if (touchFile) {
    if (!touchItem(who, file, checkPermission)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }
  }

  // find and touch father if there's one
  let father: DirectoryMetadata | undefined = undefined;
  if (touchFather && file.father) {
    father = await findDirectoryByID(file.father, options);
    if (!father) {
      throw new Error(
        `Father ${file.father} in ${file.name} was not found. This should not be happening.`
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
      (newfile as FileMetadata).father,
      options
    );
    if (!destFather) {
      throw new Error(
        `Destination father ${newfile.father} in ${newfile.name} was not found. This should not be happening.`
      );
    }

    if (!touchItem(who, destFather, checkPermission)) {
      throw new Error("Could not touch file, have you checked permissions?");
    }
  }

  // updating info
  file.name = newfile.name ? newfile.name : file.name;
  // father
  if (newfile.father && file.father != newfile.father) {
    moveFile(
      file,
      destFather ? destFather : (newfile.father as string),
      father,
      options
    );
  }
  file.owner = newfile.owner ? newfile.owner : file.owner;

  // check access array
  let isEqual = false;
  if (
    newfile.access &&
    file.access.length > 0 &&
    newfile.access.length > 0 &&
    file.access.length === newfile.access.length
  ) {
    for (let index = 0; index < newfile.access.length; index++) {
      if (
        newfile.access[index].accessLevel == file.access[index].accessLevel &&
        newfile.access[index].user == file.access[index].user
      ) {
        isEqual = false;
        break;
      }
    }
  }

  if (!isEqual && newfile.access) {
    file.access = newfile.access;
  }

  // update
  (file as any).save();
  if (father) {
    (father as any).save();
  }
  if (destFather) {
    (destFather as any).save();
  }

  return file as any;
};

/**
 * Move 'whatToChange' from 'dirTo' to 'dirFrom'.
 * @param whatToChange Id or Object of the file whos is being moved.
 * @param dirTo Id or Object of the directory where the item is being moved to.
 * @param dirFrom Id or Object of the directory where the item is being moved from. (can be inferred by 'whatToChange.father')
 * @param options Mongoose options.
 */
const moveFile = async (
  whatToChange: FileMetadata | string,
  dirTo: DirectoryMetadata | string,
  dirFrom?: DirectoryMetadata | string,
  options?: QueryOptions
) => {
  // search for file if needed
  if (typeof whatToChange === "string") {
    var toChange: FileMetadata = await findFileByID(whatToChange, options);
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
  toDir.files.push(toChange._id);
  formDir.files = removeItemOnce(formDir.files, {
    value: toChange._id,
  });
};
