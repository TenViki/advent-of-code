import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");
const cubes = new Set<string>();
const cubesUnvisited = new Set<string>();

while (inputParser.hasNext()) {
  const [x, y, z] = inputParser.nextNumberArray(",")!;

  cubes.add(`${x},${y},${z}`);
  cubesUnvisited.add(`${x},${y},${z}`);
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

console.log("Total surface area:", surface);
