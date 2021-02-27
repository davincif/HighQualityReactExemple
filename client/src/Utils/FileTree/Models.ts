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
  loadTree(
    userTree: Object,
    adapter?: (userTree: Object) => DirType | FileType
  ): void;

  /**
   * @returns a copy of the current fileTree
   */
  getTree(): DirType;

  /**
   * get a item (directory or file) in the current dir.
   * @param name Dir or file name to be searched.
   * @returns The requested item or undefined if not found.
   */
  getItem(name: string): DirType | FileType | undefined;

  /**
   * Add a new file or directory to the current browser position.
   * @param item The file or directory to be added.
   */
  addItem(item: DirType | FileType): void;

  /**
   * Remove a file or directory from the current browser position.
   * @param item The file or directory (or its position in the parent list) to be removed.
   * @returns The data removed from the tree.
   */
  rmItem(item: DirType | FileType | number): DirType | FileType;

  /**
   * Move files from the currect browser position directory to another dir accessible in the same level of the browser.
   * @param items The files or directories (or theirs position in the parent list) to be moved.
   * @returns The datas removed from the tree.
   */
  DragItems(items: (DirType | FileType | number)[]): (DirType | FileType)[];

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
  goUp(levels: number): boolean;

  /**
   * Broswer to a directory directly inside the current dir.
   * @param dir The directory (or its position in the parent list) go browser in.
   * @returns if the operation was successful.
   */
  goIn(dir: DirType | number): boolean;
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
 * @param data Any custom data from the user.
 * @type Object
 * @param father Where is this file inserted in.
 * @type DirType
 */
export type FileType = {
  name: string;
  data?: Object;

  father: DirType;
  parents: never[];
};

/**
 * A generic Directory Representation
 * @param name File name.
 * @type string
 * @param data Any custom data from the user.
 * @type Object
 * @param father Where is this directory inserted in.
 * @type DirType
 * @param parents List of files and orther dir inside this dir.
 * @type DirType[]
 */
export type DirType = {
  name: string;
  data?: Object;

  father?: DirType;
  parents: (DirType | FileType)[];
};

/**
 * Direcotry address, eg.: ['home', 'dir1', 'dirB']
 */
export type Address = string[];
