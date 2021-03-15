// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";

// Internal Imports
import {
  DirectoryMetadata,
  HollowDirectoryMetadata,
} from "../../mongoose/types/direcotry";
import {
  createDirectory,
  findDirectoryByID,
  rmDir,
} from "../../mongoose/controller/directory";
import { protectRoute } from "../../utils/controller";
import { findFileByID } from "../../mongoose/controller/file";

export default {
  RecursiveDirectory: {
    directories: async ({ directories }: any) => findDirectoryByID(directories),
    files: async ({ files }: any) => findFileByID(files),
  },
  Query: {
    getDirs: async (_: any, { ids }: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick);

      let dirs: DirectoryMetadata = await findDirectoryByID(ids);

      return dirs;
    },
    getRecursiveDirs: async (_: any, { ids }: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick);

      let dirs: DirectoryMetadata = await findDirectoryByID(ids);

      return dirs;
    },
  },
  Mutation: {
    mkdir: async (_: any, { name, where }: any, { req }: any) => {
      // request authentication
      let owner = await protectRoute(req.nick);

      // creating directory and constructing object to be responded
      let dir: any = await createDirectory(
        {
          name: name,
          father: where ? where : undefined,
          owner: owner._id,
        },
        true
      );

      let newdir: HollowDirectoryMetadata = {
        _id: dir._id,
        name: dir.name,
        father: dir.father,
        directories: dir.directories,
        files: dir.files,
        owner: dir.owner,
        createdAt: dir.createdAt,
        createdBy: dir.createdBy,
        modifiedAt: dir.modifiedAt,
        modifiedBy: dir.modifiedBy,
        access: dir.access,
      };

      return newdir;
    },
    rmDir: async (_: any, { id }: any, { req }: any) => {
      // request authentication
      let owner = await protectRoute(req.nick);

      let dirs = await rmDir(id, owner._id);

      return dirs;
    },
  },
};
