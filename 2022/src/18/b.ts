import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");
const cubes = new Set<string>();

let minX = Infinity;
let maxX = 0;
let minY = Infinity;
let maxY = 0;
let minZ = Infinity;
let maxZ = 0;

while (inputParser.hasNext()) {
  const [x, y, z] = inputParser.nextNumberArray(",")!;

  minX = Math.min(x, minX);
  maxX = Math.max(x, maxX);
  minY = Math.min(y, minY);
  maxY = Math.max(y, maxY);
  minZ = Math.min(z, minZ);
  maxZ = Math.max(z, maxZ);

  cubes.add(`${x},${y},${z}`);
}

const map: boolean[][][] = new Array(maxX + 1)
  .fill(0)
  .map(() =>
    new Array(maxY + 1).fill(0).map(() => new Array(maxZ + 1).fill(false))
  );

for (const cube of [...cubes.values()]) {
  const [x, y, z] = cube.split(",").map(Number);
  map[x][y][z] = true;
}

const isConnectedToAir = (x: number, y: number, z: number) => {
  const queue = [[x, y, z]];
  let visited = new Set<string>();

  while (queue.length) {
    const [x, y, z] = queue.shift()!;

    if (map[x][y][z] || visited.has(`${x},${y},${z}`)) continue;

    visited.add(`${x},${y},${z}`);

    if (x === 0 || x === map.length - 1) return true;
    if (y === 0 || y === map[x].length - 1) return true;
    if (z === 0 || z === map[x][y].length - 1) return true;

    queue.push(
      [x - 1, y, z],
      [x + 1, y, z],
      [x, y - 1, z],
      [x, y + 1, z],
      [x, y, z - 1],
      [x, y, z + 1]
    );
  }

  return false;
};

for (let x = 0; x < map.length; x++) {
  console.log("-- ROW --", x);
  for (let y = 0; y < map[x].length; y++) {
    console.log(x, y);

    for (let z = 0; z < map[x][y].length; z++) {
      let value = map[x][y][z];
      if (value) continue;
      if (isConnectedToAir(x, y, z)) continue;

      cubes.add(`${x},${y},${z}`);
    }
  }
}

const cubesUnvisited = new Set<string>();
for (const cube of [...cubes.values()]) {
  cubesUnvisited.add(cube);
}

let surface = cubes.size * 6;

const queue = [[...cubes.values()][0]];

const str = (x: number, y: number, z: number) => {
  return `${x},${y},${z}`;
};

while (cubesUnvisited.size) {
  if (queue.length) {
    const cube = queue.shift()!;

    if (!cubesUnvisited.has(cube)) continue;
    cubesUnvisited.delete(cube);

    const [x, y, z] = cube.split(",").map(Number);

    if (cubes.has(str(x - 1, y, z))) {
      surface -= 1;
      queue.push(str(x - 1, y, z));
    }

    if (cubes.has(str(x + 1, y, z))) {
      surface -= 1;
      queue.push(str(x + 1, y, z));
    }

    if (cubes.has(str(x, y - 1, z))) {
      surface -= 1;
      queue.push(str(x, y - 1, z));
    }

    if (cubes.has(str(x, y + 1, z))) {
      surface -= 1;
      queue.push(str(x, y + 1, z));
    }

    if (cubes.has(str(x, y, z - 1))) {
      surface -= 1;
      queue.push(str(x, y, z - 1));
    }

    if (cubes.has(str(x, y, z + 1))) {
      surface -= 1;
      queue.push(str(x, y, z + 1));
    }
  } else {
    queue.push([...cubesUnvisited.values()][0]);
  }
}

console.log("Total exterior surface area:", surface);
