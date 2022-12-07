import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const filesystemSize = 70000000;
const requiredForUpdate = 30000000;

interface File {
  type: "file";
  name: string;
  size: number;
}

interface Folder {
  type: "folder";
  name: string;
  children: { [fname: string]: Folder | File };
  parent: Folder | null;
  size: number;
}

const root: Folder = {
  type: "folder",
  name: "/",
  children: {},
  size: 0,
  parent: null,
};

let currentPath: Folder = root;

while (inputParser.hasNext()) {
  const [, command, args] = inputParser.next()!.split(" ");

  if (command === "cd") {
    if (args === "..") {
      if (currentPath.parent) {
        currentPath = currentPath.parent;
      }
    } else if (args === "/") {
      currentPath = root;
    } else {
      currentPath = currentPath.children[args] as Folder;
    }

    continue;
  }

  while (inputParser.next(false) && !inputParser.next(false)?.startsWith("$")) {
    const [sizeOrDir, name] = inputParser.next()!.split(" ");

    if (sizeOrDir === "dir") {
      // Create folder
      const folder: Folder = {
        type: "folder",
        name,
        children: {},
        size: 0,
        parent: currentPath,
      };

      currentPath.children[name] = folder;
    } else {
      // Create file
      const file: File = {
        type: "file",
        name,
        size: parseInt(sizeOrDir),
      };

      currentPath.children[name] = file;
    }
  }
}

const folderSizes: number[] = [];

const calculateFolderSize = (folder: Folder): number => {
  let size = 0;
  for (const child of Object.values(folder.children)) {
    if (child.type === "file") {
      size += child.size;
    } else {
      size += calculateFolderSize(child);
    }
  }

  folder.size = size;
  folderSizes.push(size);
  return size;
};

calculateFolderSize(root);

const spaceAvailable = filesystemSize - root.size;
const spaceRequired = requiredForUpdate - spaceAvailable;

console.log(
  "To delete:",
  Math.min(...folderSizes.filter((s) => s > spaceRequired))
);
