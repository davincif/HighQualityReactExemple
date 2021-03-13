// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";

// Internal Imports
import { findUser } from "../../mongoose/controller/user";
import { HollowFileMetadata } from "../../mongoose/types/file";
import { createFile } from "../../mongoose/controller/file";

export default {
  Query: {
    // code
  },
  Mutation: {
    touch: async (_: any, { name, where }: any, { req }: any) => {
      if (!req.nick) {
        throw new AuthenticationError("not loged");
      }

      // check if owner exists and get it's ID
      let owner: any = await findUser({ nick: req.nick });
      if (!(owner && owner.active)) {
        // the user doesn't exist or is inactive
        throw new UserInputError(`${req.nick} is not a valid user`);
      }

      // creating file and constructing object to be responded
      let file: any = await createFile({
        name: name,
        father: where ? where : undefined,
        owner: owner._id,
      });

      let newfile: HollowFileMetadata = {
        _id: file._id,
        name: file.name,
        father: file.father,
        owner: file.owner,
        createdAt: file.createdAt,
        createdBy: file.createdBy,
        modifiedAt: file.modifiedAt,
        modifiedBy: file.modifiedBy,
        access: file.access,
      };

      return newfile;
    },
  },
};
