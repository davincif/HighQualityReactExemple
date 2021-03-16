// Third Party Imports
import { ForbiddenError } from "apollo-server-express";

// Internal Imports
import {
  DirectoryMetadata,
  HollowDirectoryMetadata,
} from "../../mongoose/types/direcotry";
import {
  createDirectory,
  findDirectoryByID,
  rmDir,
  updateDir,
} from "../../mongoose/controller/directory";
import { findFileByID } from "../../mongoose/controller/file";
import { checkItemEditPerm, protectRoute } from "../../utils/controller";
import { removeItemOnce } from "../../utils/utils";

export default {
  RecursiveDirectory: {
    directories: async ({ directories }: any) => findDirectoryByID(directories),
    files: async ({ files }: any) => findFileByID(files),
  },
  Query: {
    directories: async (_: any, { ids }: any, { req }: any) => {
      // request authentication
      await protectRoute(req.nick);

      let dirs: DirectoryMetadata = await findDirectoryByID(ids);

      return dirs;
    },
    recursiveDirectories: async (_: any, { ids }: any, { req }: any) => {
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
    changeDirName: async (_: any, { id, name }: any, { req }: any) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let dir: DirectoryMetadata = await findDirectoryByID(id);
      if (!dir) {
        throw new Error(`The directory "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, dir)) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // update
      return await updateDir({ id, who: user._id, newdir: { name }, dir });
    },
    changeDirFather: async (_: any, { id, newFather }: any, { req }: any) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let dir: DirectoryMetadata = await findDirectoryByID(id);
      if (!dir) {
        throw new Error(`The directory "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, dir, "MANAGER")) {
        throw new ForbiddenError(
          "Not Allowed, You need to be Manager of a directory to move it."
        );
      }

      // update
      return await updateDir({
        id,
        who: user._id,
        newdir: { father: newFather },
        checkPermission: true,
        dir,
        touchDir: true,
        touchFather: true,
        touchDestinationFather: true,
      });
    },
    changeDirOwnership: async (_: any, { id, newOwner }: any, { req }: any) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let dir: DirectoryMetadata = await findDirectoryByID(id);
      if (!dir) {
        throw new Error(`The directory "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, id, "OWNER")) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // update
      return await updateDir({
        id,
        who: user._id,
        newdir: { owner: newOwner },
        dir,
      });
    },
    giveDirAccess: async (
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

      let dir: DirectoryMetadata = await findDirectoryByID(id);
      if (!dir) {
        throw new Error(`The directory "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, dir, "MANAGER")) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // add access
      let found = false;
      for (let acs of dir.access) {
        if (acs.user === who) {
          if (acs.accessLevel !== newAccess) {
            acs.accessLevel = newAccess;
          }
          break;
        }
      }

      if (!found) {
        dir.access.push({ user: who, accessLevel: newAccess });
      }

      await (dir as any).save();
      return dir;
    },
    removeDirAccess: async (_: any, { id, who }: any, { req }: any) => {
      // request authentication
      let user = await protectRoute(req.nick);

      let dir: DirectoryMetadata = await findDirectoryByID(id);
      if (!dir) {
        throw new Error(`The directory "${id}" was not found.`);
      }

      // check permissions
      if (!checkItemEditPerm(user._id, dir, "MANAGER")) {
        throw new ForbiddenError("Not Allowed, check your permissions.");
      }

      // rm access
      let index = -1;
      for (let idx in dir.access) {
        if (dir.access[idx].user === who) {
          index = Number(idx);
          break;
        }
      }

      if (index !== -1) {
        removeItemOnce(dir.access, { index });
      }

      await (dir as any).save();
      return dir;
    },
  },
};
