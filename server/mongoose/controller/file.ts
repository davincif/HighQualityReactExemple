// Third Party Imports
import { QueryOptions } from "mongoose";

// Internal Imports
import File from "../models/files";
import { HollowFileMetadata } from "../types/file";
import { findDirectoryByID } from "./directory";
import { touchItem } from "./utils";

export const createFile = async (
  file: HollowFileMetadata,
  creator?: string,
  options?: QueryOptions
) => {
  // treating entries
  file.createdBy = file.createdBy ? file.createdBy : file.owner;
  creator = creator ? creator : file.owner ? file.owner : "";
  if (!creator && !file.createdBy) {
    throw new Error(`The File must have a creator or an onwer`);
  }
  if (!file.father) {
    throw new Error(`The File must have a father`);
  }

  // touch father item if there is one
  let father: any = await findDirectoryByID(file.father, options);
  if (!father) {
    throw new Error(
      `Father ${file.father} in ${file.name} from ${creator} was not found. This should not be happening`
    );
  }

  if (!touchItem(creator, father)) {
    throw new Error("Could not touch file, have you checked permissions?");
  }

  // TODO: think about if we should implement this feature
  // check if there is other file or directory with the same name.

  // creating file and updating father
  let createdFile: any = await File.create([file], options);
  if (!createdFile || createdFile.length <= 0) {
    throw new Error(`Could not craete the directory ${file.name}`);
  }

  createdFile = createdFile[0];
  father.files.push(createdFile._id);
  await father.save();

  return createdFile;
};

export const findFileByID = async (id: string, options?: QueryOptions) => {
  return await File.findById(id, undefined, options);
};
