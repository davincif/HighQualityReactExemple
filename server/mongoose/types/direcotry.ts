import { AccessLevel } from "./permissions";

export type DirectoryMetadata = {
  _id: string;
  name: string;
  father: string;
  directories: string[];
  files: string[];
  owner: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  access: {
    user: string;
    accessLevel: AccessLevel;
  }[];
};

export type HollowDirectoryMetadata = {
  _id?: string;
  name?: string;
  father?: string;
  directories?: string[];
  files?: string[];
  owner?: string;
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  access?: {
    user: string;
    accessLevel: AccessLevel;
  }[];
};
