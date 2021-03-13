// Third Party Imports
import { QueryOptions } from "mongoose";

// Internal Imports
import Directory from "../models/directory";
import { HollowDirectoryMetadata } from "../types/direcotry";
import { touchItem } from "./utils";

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
        `Father ${dir.father} in ${dir.name} from ${creator} was not found. This should not be happening`
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
