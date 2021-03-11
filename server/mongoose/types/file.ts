import { AccessLevel } from "./permissions";

export type FileMetadata = {
  _id: string;
  name: string;
  father: string;
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

export type HollowFileMetadata = {
  _id?: string;
  name?: string;
  father?: string;
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
