const defaultValue = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;
const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const textarea = document.querySelector("textarea");
textarea!.placeholder = defaultValue;

const filesystemSize = 70000000;

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

const path = document.getElementById("path")!;
const fileTable = document.getElementById("file-table")!;

const formatSize = (size: number) => {
  if (size < 1000) {
    return size + " b";
  } else if (size < 1000000) {
    return (size / 1000).toFixed(2) + " kb";
  } else if (size < 1000000000) {
    return (size / 1000000).toFixed(2) + " Mb";
  } else {
    return (size / 1000000000).toFixed(2) + " Gb";
  }
};

const createTableCell = (className: string, value: string) => {
  const cell = document.createElement("td");
  cell.className = className;
  cell.innerText = value;
  return cell;
};

const getFolder = (folderPath: string) => {
  const names = folderPath.split("/").filter((n) => n);
  let folder: Folder = root;

  for (const name of names) {
    folder = folder.children[name] as Folder;
  }

  return folder;
};

const changeBack = () => {
  const currentPath = path.innerText;
  const newPath = currentPath.split("/").slice(0, -1).join("/");
  path.innerText = newPath;

  const folder = getFolder(newPath);
  changeDir(folder);
};

const changeDir = (folder: Folder) => {
  let folderPath = folder.name;
  let currentFolder = folder;

  while (currentFolder.parent) {
    currentFolder = currentFolder.parent;
    folderPath =
      (currentFolder.name == "/" ? "" : currentFolder.name) + "/" + folderPath;
  }

  path.innerText = folderPath;

  fileTable.innerHTML = "";

  for (const child of Object.values(folder.children).sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    } else if (a.type === "folder") {
      return -1;
    } else {
      return 1;
    }
  })) {
    const row = document.createElement("tr");
    row.classList.add("file-row");
    row.classList.add(child.type);
    const type = createTableCell("type", child.type);
    const name = createTableCell("name", child.name);
    const size = createTableCell("size", formatSize(child.size));

    row.appendChild(type);
    row.appendChild(name);
    row.appendChild(size);

    row.addEventListener("click", () => {
      if (child.type === "folder") {
        changeDir(child as Folder);
      }
    });

    fileTable.appendChild(row);
  }
};

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
  return size;
};

const run = async () => {
  root.children = {};
  root.size = 0;
  const workingValue = textarea!.value || defaultValue;
  const input = workingValue.split("\n").map((s) => s.trim());

  for (let i = 0; i < input.length; i++) {
    const [, command, args] = input[i].split(" ");

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

    while (input[i + 1] && !input[i + 1].startsWith("$")) {
      const [sizeOrDir, name] = input[i + 1].split(" ");
      i++;

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

  calculateFolderSize(root);

  changeDir(root);

  document.getElementById("progress-bar-inner").style.width = `${
    (root.size / filesystemSize) * 0
  }%`;

  document.getElementById("progress-text").innerHTML = `Used <span>${formatSize(
    root.size
  )}</span> of available <span>${formatSize(filesystemSize)}</span>`;

  document.getElementById("progress").style.display = "block";
  await wait(100);
  document.getElementById("progress-bar-inner").style.width = `${
    (root.size / filesystemSize) * 100
  }%`;

  console.log(root);
};

export {};
