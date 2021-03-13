// Third Party Imports
import { AuthenticationError, UserInputError } from "apollo-server-express";

// Internal Imports
import { findUser } from "../../mongoose/controller/user";
import { FileMetadata, HollowFileMetadata } from "../../mongoose/types/file";
import { createFile, rmFile } from "../../mongoose/controller/file";
import { protectRoute } from "../../mongoose/controller/utils";

export default {
  Query: {
    // code
  },
  Mutation: {
    touch: async (_: any, { name, where }: any, { req }: any) => {
      // request authentication
      let owner = await protectRoute(req.nick);

      // creating file and constructing object to be responded
      let file: any = await createFile(
        {
          name: name,
          father: where ? where : undefined,
          owner: owner._id,
        },
        true
      );

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
    rmFile: async (_: any, { id }: any, { req }: any) => {
      // request authentication
      let owner = await protectRoute(req.nick);

      // remove and get file removed
      let file = await rmFile(id, owner._id, true);

      // construct response obj
      let delfile: FileMetadata = {
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

      return delfile;
    },
  },
};
