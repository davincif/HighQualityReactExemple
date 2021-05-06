import { DirType, FSItem } from "./Models";

export function isFile(item?: FSItem): boolean {
  return item ? (item as any).children === undefined : false;
}

export function areNamesDiferents(children: FSItem[]): boolean {
  let names: string[] = [];
  let foundRepeatedName = false;

  for (let item of children) {
    if (names.indexOf(item.name) !== -1) {
      foundRepeatedName = true;
      break;
    }

    names.push(item.name);
  }

  return !foundRepeatedName;
}

export function findItemIndexInDir(where: DirType, what: DirType): number {
  return where.children.indexOf(what);
}
