// Third Party Imports
import { QueryOptions } from "mongoose";

// Internal Imports
import File from "../models/files";
import { DirectoryMetadata } from "../types/direcotry";
import { HollowFileMetadata } from "../types/file";
import { findDirectoryByID } from "./directory";
import { touchItem } from "./utils";

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
 * @param id ID of the file to be found.
 * @param options mongoose options.
 * @returns Whatever was found or null.
 */
export const findFileByID = async (id: string, options?: QueryOptions) => {
  return await File.findById(id, undefined, options);
};

/**
 * Telete the requested file in the name.
 * @param id Id of the file to be removed.
 * @param who In case a permission check must be performed.
 * @param checkPermission In case a permission check must be performed on who is removing the file. Default: false.
 * @param options mongoose options
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
