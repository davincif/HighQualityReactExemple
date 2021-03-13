// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";

// Internal Imports
import { HollowDirectoryMetadata } from "../../mongoose/types/direcotry";
import { createDirectory } from "../../mongoose/controller/directory";
import { protectRoute } from "../../mongoose/controller/utils";

export default {
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
  },
};
