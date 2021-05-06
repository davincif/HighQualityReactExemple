/**
 * The file tree class interface.
 */
export interface FileTreeInterface {
  // /**
  //  * The current file tree being treated in the object.
  //  */
  // fileTree: DirType;

  // /**
  //  * The browser is where the operations are gonna be applyed in the tree.
  //  */
  // browser: Browser;

  /**
   * Load the user tree in the FileTree object.
   * @param userTree The user tree to be transformed into a FileTree.
   * @param adapter A function to be applyed on every user object in order to transfor it in a leaf.
   */
  loadTree(userTree: Object, adapter?: (userTree: Object) => FSItem): void;

  /**
   * Get the Entire file tree
   * @returns a copy of the current file tree
   */
  getTree(): DirType;

  /**
   * Get the curret browser position file subtree
   */
  getCurrentTree(): DirType;

  /**
   * Get a item (directory or file) in the current dir.
   * @param name Dir or file name to be searched.
   * @returns The requested item and it's index or empty list if not found.
   */
  getItem(name: string): [FSItem, number] | [];

  /**
   * Add a new file or directory to the current browser position.
   * @param item The file or directory to be added.
   */
  addItem(item: FSItem): void;

  /**
   * Remove a file or directory from the current browser position.
   * @param item The file's or directory's position in the parent list to be removed.
   * @returns The data removed from the tree.
   */
  rmItem(item: number): FSItem;

  /**
   * Move files from the currect browser position directory to another dir accessible in the same level of the browser.
   * @param items The files' or directories' positions in the parent list to be moved.
   * @param to The directories' positions for the items to be moved to.
   * @returns The datas removed from the tree.
   */
  dragItems(items: number[], to: number): FSItem[];

  /**
   * Browser to the given address.
   * @param address The addres to go as: ['home', 'dir1', 'dirB']
   * @returns if the operation was successful.
   */
  goToAddress(address: Address): boolean;

  /**
   * Go up on the file tree. Equivalent of clicking in the back arrow in a file browser.
   * @param levels How much levels to go up on the Stack.
   * @returns how many levels were possible to ascend
   */
  goUp(levels: number): number;

  /**
   * Broswer to a directory directly inside the current dir.
   * @param dir The directory's position in the parent list go browser in.
   * @returns if the operation was successful.
   */
  goIn(dir: number): boolean;
}

/**
 * A browser capable of navigating through the file tree.
 */
export interface Browser {
  // /**
  //  * A referece to were the browser is now.
  //  */
  // pointer: DirType;

  // /**
  //  * navStack The Navegation Stack.
  //  */
  // navStack: DirType[];

  /**
   * Get the address of the browser.
   * @return The addres in a list like: ['home', 'dir1', 'dirB']
   */
  getAdress(): Address;

  /**
   * Browser up "levels" times in the navagation stack.
   * @param levels How many times to take off from the steck.
   * @return number of stacks actually taken from stack.
   */
  navUp(levels: number): number;

  /**
   * Browser to a directory inside the current directory.
   * @param dir The directory (or its position in the parent list) to browser to.
   * @returns if the operation was successful.
   */
  navDown(dir: DirType | number): boolean;

  /**
   * Browser to the given address.
   * @param address The address to navigate to, eg.: ['home', 'dir1', 'dirB']
   * @returns if the operation was successful.
   */
  navTo(address: Address): boolean;
}

/**
 * A generic File Representation
 * @param name File name.
 * @type string
 * @param father Where is this file inserted in.
 * @type DirType
 */
export type FileType = {
  [field: string]: any;
  name: string;

  father: DirType;
  children: never[];
};

/**
 * A generic Directory Representation
 * @param name File name.
 * @type string
 * @param father Where is this directory inserted in.
 * @type DirType
 * @param children List of files and orther dir inside this dir.
 * @type DirType[]
 */
export type DirType = {
  [field: string]: any;
  name: string;

  father?: DirType;
  children: FSItem[];
};

/**
 * Direcotry address, eg.: ['home', 'dir1', 'dirB']
 */
export type Address = string[];

/**
 * File System Item, it can be a directory or a file.
 */
export type FSItem = DirType | FileType;
