import {
  Address,
  Browser,
  DirType,
  FileTreeInterface,
  FileType,
} from "./Models";
import { TreeBrowser } from "./Browser";
import { areNamesDiferents, isFile } from "./Utils";

export class FileTree implements FileTreeInterface {
  private fileTree!: DirType;
  private browser!: Browser;

  constructor(
    userTree: Object,
    adapter?: (userTree: Object) => DirType | FileType
  ) {
    this.loadTree(userTree, adapter);
  }

  private recursiveLoadTree(
    subTree: DirType,
    adapter?: (userTree: Object) => DirType | FileType
  ): DirType {
    // adapt all parents in this directory
    let adapteds = subTree.parents.map((value) => {
      return adapter ? adapter(value) : value;
    });

    // check names
    if (!areNamesDiferents(adapteds)) {
      throw new Error(
        `in the directory "${subTree.name}" there are parents with the same name`
      );
    }

    // load all directories inside this dir
    subTree.parents = adapteds.map((value) => {
      if (!isFile(value)) {
        value.father = value as DirType;
        value = this.recursiveLoadTree(value as DirType, adapter);
      }

      return value;
    });

    return subTree;
  }

  public loadTree(
    userTree: Object,
    adapter?: (userTree: Object) => DirType | FileType
  ): void {
    let fatherDir = adapter
      ? adapter(userTree)
      : (userTree as DirType | FileType);

    // the father must always be a directory
    if (isFile(fatherDir)) {
      console.log("fatherDir", fatherDir);
      throw new Error(
        `the "${fatherDir.name}" father must always be a directory`
      );
    }

    this.fileTree = this.recursiveLoadTree(fatherDir as DirType, adapter);
    this.browser = new TreeBrowser(this.fileTree);
  }

  public getTree(): DirType {
    return { ...this.fileTree };
  }

  public getItem(name: string): DirType | FileType | undefined {
    throw new Error("Method not implemented.");
  }

  public addItem(item: DirType | FileType): void {
    throw new Error("Method not implemented.");
  }

  public rmItem(item: number | DirType | FileType): DirType | FileType {
    throw new Error("Method not implemented.");
  }

  public DragItems(
    items: (number | DirType | FileType)[]
  ): (DirType | FileType)[] {
    throw new Error("Method not implemented.");
  }

  public goToAddress(address: Address): boolean {
    throw new Error("Method not implemented.");
  }

  public goUp(levels: number): boolean {
    throw new Error("Method not implemented.");
  }

  public goIn(dir: number | DirType): boolean {
    throw new Error("Method not implemented.");
  }
}
