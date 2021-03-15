// Third Party Imports
import { QueryOptions } from "mongoose";

// Internal Imports
import Directory from "../models/directory";
import { DirectoryMetadata, HollowDirectoryMetadata } from "../types/direcotry";
import { rmFiles } from "./file";
import { checkItemEditPerm, touchItem } from "../../utils/controller";

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
 * @param touch If the file's father shall be touched or not. Default true.
 * @returns
 */
export const rmDir = async (
  id: string,
  who: string,
  checkPermission = false,
  options?: QueryOptions,
  touch = true
) => {
  let dir: DirectoryMetadata = await findDirectoryByID(id);

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
