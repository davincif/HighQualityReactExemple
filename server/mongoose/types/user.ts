export type UserMetadata = {
  _id: string;
  nick: string;
  name: string;
  password: string;
  email: string;
  birth: string;
  active: boolean;
};

export type HollowUserMetadata = {
  _id?: string;
  nick?: string;
  name?: string;
  password?: string;
  email?: string;
  birth?: string;
  active?: boolean;
};
