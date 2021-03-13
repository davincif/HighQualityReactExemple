// Third Party Imports

// Internal Imports
import { FileMetadata, HollowFileMetadata } from "../../mongoose/types/file";
import {
  createFile,
  findFileByID,
  rmFile,
} from "../../mongoose/controller/file";
import { protectRoute } from "../../mongoose/controller/utils";
import { findDirectoryByID } from "../../mongoose/controller/directory";
import { DirectoryMetadata } from "../../mongoose/types/direcotry";

export default {
  Query: {
    getFilesInDirs: async (_: any, { dirIds }: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick, true);

      // search for given directories
      let dirs = await findDirectoryByID(dirIds);

      // create file list to be obtained
      let fileIDList = (dirs as DirectoryMetadata[])
        .map((value) => value.files)
        .flat(1);

      // find all files
      let fileList = await findFileByID(fileIDList);

      return fileList;
    },
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
    rmFile: async (_: any, { fileId }: any, { req }: any) => {
      // request authentication
      let owner = await protectRoute(req.nick);

      // remove and get file removed
      let file = await rmFile(fileId, owner._id, true);

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
