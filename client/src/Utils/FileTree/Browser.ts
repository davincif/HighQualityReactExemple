import { Address, Browser, DirType } from "./Models";
import { findItemIndexInDir, isFile } from "./Utils";

export class TreeBrowser implements Browser {
  public pointer: DirType;

  private navStack: DirType[];

  constructor(fileTree: DirType) {
    this.pointer = fileTree;
    this.navStack = [fileTree];
  }

  public getAdress(): Address {
    return this.navStack.map((value) => value.name);
  }

  public navUp(levels: number): number {
    let taken: number;
    let save = this.navStack[0];

    // remove "levels" from stack
    let popped: DirType | undefined;
    for (taken = 0; taken < levels; taken++) {
      popped = this.navStack.pop();
      // just in case there's nothing to be poped already
      if (popped) {
        this.pointer = popped;
      } else {
        break;
      }
    }

    // update pointer
    if (popped) {
      this.pointer = this.navStack[this.navStack.length - 1];
    } else {
      this.pointer = save;
      this.navStack.push(save);
    }

    return taken;
  }

  public navDown(dir: number | DirType): boolean {
    if (typeof dir === "number") {
      // cannot navigate to a file or dir is out of range
      if (
        dir < 0 &&
        dir >= this.pointer.parents.length &&
        isFile(this.pointer.parents[dir])
      ) {
        return false;
      }
    } else {
      // check if the directory is inside the current dir
      dir = findItemIndexInDir(this.pointer, dir);
      if (dir === -1) {
        return false;
      }
    }

    // move pointer
    this.pointer = this.pointer.parents[dir] as DirType;
    this.navStack.push(this.pointer);

    return true;
  }

  public navTo(address: Address): boolean {
    let newPointer = this.navStack[0];
    let newNavStack: DirType[] = [];

    // check if the address is in this file tree
    if (address[0] !== newNavStack[0].name) {
      return false;
    }

    // get in the tree, address by address
    address.slice(1, address.length).map((getIn) => {
      // search address in the new pointer directory
      let found = newPointer.parents.filter((value) => getIn === value.name);

      // address not found in dir or address is a file
      if (found.length === 0 || isFile(found[0])) {
        return false;
      } else if (found.length > 1) {
        /*
        this is an special case of error the were are not gonna do anyting
        about now actually it should simply never happen is whoever is using
        the Browser do the job right ^^'
        */
        return false;
      }

      // insert dir in the new stack
      newNavStack.push(newPointer);
      newPointer = found[0] as DirType;
    });

    // update current pointers
    this.pointer = newPointer;
    this.navStack = newNavStack;

    return true;
  }
}
