// Third Party Imports

// Internal Imports
import { FileMetadata, HollowFileMetadata } from "../../mongoose/types/file";
import {
  createFile,
  findFileByID,
  rmFile,
  updateFile,
} from "../../mongoose/controller/file";
import { checkItemEditPerm, protectRoute } from "../../utils/controller";
import { findDirectoryByID } from "../../mongoose/controller/directory";
import { DirectoryMetadata } from "../../mongoose/types/direcotry";
import { ForbiddenError } from "apollo-server-express";
import { removeItemOnce } from "../../utils/utils";

export default {
  Query: {
    files: async (_: any, { ids }: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick, true);

      // find all files
      let files: FileMetadata = await findFileByID(ids);

      return files;
    },
    filesInDirs: async (_: any, { dirIds }: any, { req }: any) => {
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
    changeFileName: async (_: any, { id, name }: any, { req }: any) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let file: FileMetadata = await findFileByID(id);
      if (!file) {
        throw new Error(`The file "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, file)) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // update
      return await updateFile({ id, who: user._id, newfile: { name }, file });
    },
    changeFileFather: async (_: any, { id, newFather }: any, { req }: any) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let file: FileMetadata = await findFileByID(id);
      if (!file) {
        throw new Error(`The directory "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, file, "MANAGER")) {
        throw new ForbiddenError(
          "Not Allowed, You need to be Manager of a file to move it."
        );
      }

      // update
      return await updateFile({
        id,
        who: user._id,
        newfile: { father: newFather },
        checkPermission: true,
        file,
        touchFile: true,
        touchFather: true,
        touchDestinationFather: true,
      });
    },
    changeFileOwnership: async (
      _: any,
      { id, newOwner }: any,
      { req }: any
    ) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let file: FileMetadata = await findFileByID(id);
      if (!file) {
        throw new Error(`The file "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, id, "OWNER")) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // update
      return await updateFile({
        id,
        who: user._id,
        newfile: { owner: newOwner },
        file,
      });
    },
    giveFileAccess: async (
      _: any,
      { id, who, newAccess }: any,
      { req }: any
    ) => {
      // check entries
      if (newAccess === "OWNER") {
        throw new Error(
          `Connot give owner access, there can be only one owner.`
        );
      }

      // request authentication
      let user = await protectRoute(req.nick);

      let file: FileMetadata = await findFileByID(id);
      if (!file) {
        throw new Error(`The file "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, file, "MANAGER")) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // add access
      let found = false;
      for (let acs of file.access) {
        if (acs.user === who) {
          if (acs.accessLevel !== newAccess) {
            acs.accessLevel = newAccess;
          }
          break;
        }
      }

      if (!found) {
        file.access.push({ user: who, accessLevel: newAccess });
      }

      await (file as any).save();
      return file;
    },
    removeFileAccess: async (_: any, { id, who }: any, { req }: any) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let file: FileMetadata = await findFileByID(id);
      if (!file) {
        throw new Error(`The File "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, file, "MANAGER")) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // rm access
      let index = -1;
      for (let idx in file.access) {
        if (file.access[idx].user === who) {
          index = Number(idx);
          break;
        }
      }

      if (index !== -1) {
        removeItemOnce(file.access, { index });
      }

      await (file as any).save();
      return file;
    },
  },
};
