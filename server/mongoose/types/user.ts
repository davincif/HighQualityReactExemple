export type UserMetadata = {
  _id: string;
  nick: string;
  name: string;
  password: string;
  email: string;
  birth: string;
  accessLevel: "master" | "family" | "guest";
  active: boolean;
};

export type HollowUserMetadata = {
  _id?: string;
  nick?: string;
  name?: string;
  password?: string;
  email?: string;
  birth?: string;
  accessLevel?: "master" | "family" | "guest";
  active?: boolean;
};

export const validAcessLevels = ["master", "family", "guest"];
