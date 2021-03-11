// Third Party Imports
import { QueryOptions } from "mongoose";

// Internal Imports
import Directory from "../models/directory";
import { DirectoryMetadata, HollowDirectoryMetadata } from "../types/direcotry";
import { touchItem } from "./utils";

export const createDirectory = async (
  dir: HollowDirectoryMetadata,
  creator?: string,
  options?: QueryOptions
) => {
  // treating entries
  dir.createdBy = dir.createdBy ? dir.createdBy : dir.owner;
  creator = creator ? creator : dir.owner ? dir.owner : "";
  if (!creator && !dir.createdBy) {
    throw new Error(`the Directory must have a creator or an onwer`);
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

    if (!touchItem(creator, father)) {
      throw new Error("could not touch file, have you checked permissions?");
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

export const findDirectoryByID = async (id: string, options?: QueryOptions) => {
  return await Directory.findById(id, undefined, options);
};
