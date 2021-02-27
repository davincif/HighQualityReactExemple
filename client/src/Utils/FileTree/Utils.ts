import { DirType, FileType } from "./Models";

export function isFile(item?: DirType | FileType): boolean {
  return item ? (item as any).parents === undefined : false;
}

export function areNamesDiferents(parents: (DirType | FileType)[]): boolean {
  let names: string[] = [];
  let foundRepeatedName = false;

  for (let item of parents) {
    if (names.indexOf(item.name) !== -1) {
      foundRepeatedName = true;
      break;
    }

    names.push(item.name);
  }

  return !foundRepeatedName;
}

export function findItemIndexInDir(where: DirType, what: DirType): number {
  return where.parents.indexOf(what);
}
