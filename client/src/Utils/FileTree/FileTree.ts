import { Address, DirType, FileTreeInterface, FSItem } from "./Models";
import { TreeBrowser } from "./Browser";
import { areNamesDiferents, isFile } from "./Utils";

export class FileTree implements FileTreeInterface {
  private fileTree!: DirType;
  private browser!: TreeBrowser;

  constructor(userTree: Object, adapter?: (userTree: Object) => FSItem) {
    this.loadTree(userTree, adapter);
  }

  private recursiveLoadTree(
    subTree: DirType,
    adapter?: (userTree: Object) => FSItem
  ): DirType {
    // adapt all children in this directory
    let adapteds = subTree.children.map((value) => {
      return adapter ? adapter(value) : value;
    });

    // check names
    if (!areNamesDiferents(adapteds)) {
      throw new Error(
        `in the directory "${subTree.name}" there are children with the same name`
      );
    }

    // load all directories inside this dir
    subTree.children = adapteds.map((value) => {
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
    adapter?: (userTree: Object) => FSItem
  ): void {
    let fatherDir = adapter ? adapter(userTree) : (userTree as FSItem);

    // the father must always be a directory
    if (isFile(fatherDir)) {
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

  public getCurrentTree(): DirType {
    return { ...this.browser.pointer };
  }

  public getItem(name: string): [FSItem, number] | [] {
    let found: [FSItem, number] | [] = [];

    for (let dir in this.browser.pointer.children) {
      if (this.browser.pointer.children[dir].name === name) {
        found = [this.browser.pointer.children[dir], Number(dir)];
        break;
      }
    }

    return found;
  }

  public addItem(item: FSItem): void {
    throw new Error("Method not implemented.");
  }

  public rmItem(item: number): FSItem {
    throw new Error("Method not implemented.");
  }

  public dragItems(items: number[], to: number): FSItem[] {
    let here = this.browser.pointer.children;
    let dragTo = this.browser.pointer.children[to] as DirType;
    if (!isFile(dragTo)) {
      let itemsAdded: FSItem[] = [];

      for (let item of items) {
        dragTo.children.push(here[item]);
        itemsAdded.push(here[item]);
        here[item] = undefined as any;
      }
      this.browser.pointer.children = here.filter(
        (value) => value !== undefined
      );

      return itemsAdded;
    } else {
      return [];
    }
  }

  public goToAddress(address: Address): boolean {
    return this.browser.navTo(address);
  }

  public goUp(levels: number): number {
    return this.browser.navUp(levels);
  }

  public goIn(dir: number): boolean {
    return this.browser.navDown(dir);
  }

  public getAdress(): Address {
    return this.browser.getAdress();
  }
}
