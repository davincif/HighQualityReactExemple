// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";

// Internal Imports
import { HollowDirectoryMetadata } from "../../mongoose/types/direcotry";
import { createDirectory } from "../../mongoose/controller/directory";
import { findUser } from "../../mongoose/controller/user";

export default {
  Mutation: {
    mkdir: async (_: any, { name, where }: any, { req }: any) => {
      if (!req.nick) {
        throw new AuthenticationError("not loged");
      }

      // check if owner exists and get it's ID
      let owner: any = await findUser({ nick: req.nick });
      if (!(owner && owner.active)) {
        // the user doesn't exist or is inactive
        throw new UserInputError(`${req.nick} is not a valid user`);
      }

      // creating directory and constructing objecto to be responded
      let dir: any = await createDirectory({
        name: name,
        father: where ? where : undefined,
        owner: owner._id,
      });

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
