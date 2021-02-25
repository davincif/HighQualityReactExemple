export type Item = {
  _id?: string;
  name: string;
  insideFiles?: FileTree;
};

export type FileTree = {
  [node: string]: Item;
};
