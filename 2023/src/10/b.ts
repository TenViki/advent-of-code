import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

// connections in y x format
const connections: { [k: string]: [number, number][] } = {
  "|": [
    [-1, 0],
    [1, 0],
  ],
  "-": [
    [0, -1],
    [0, 1],
  ],
  L: [
    [-1, 0],
    [0, 1],
  ],
  "7": [
    [0, -1],
    [1, 0],
  ],
  F: [
    [1, 0],
    [0, 1],
  ],
  J: [
    [0, -1],
    [-1, 0],
  ],
};

const grid: string[][] = [];
while (parser.hasNext()) grid.push(parser.next()!.split(""));

const connectionMap = new Map<string, [number, number][]>();

let sPosition: [number, number];

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    let val = grid[y][x];
    if (val === ".") continue;

    if (val === "S") {
      sPosition = [y, x];
      continue;
    }

    let c = connections[val];

    let pieceConnections = c.map((s) => [s[0] + y, s[1] + x]) as [
      number,
      number,
    ][];
    connectionMap.set(`${y};${x}`, pieceConnections);
  }
}

const visited = new Map<string, number>();
visited.set(`${sPosition![0]};${sPosition![1]}`, 0);
const queue: string[] = [];

// find the two pipes that connect to S
for (const [key, value] of connectionMap) {
  if (value.find((c) => c[0] == sPosition[0] && c[1] == sPosition[1])) {
    queue.push(key);
    visited.set(key, 1);
  }
}

let sPipeShape = "";
const q1 = queue[0].split(";").map(Number);
const q2 = queue[1].split(";").map(Number);

for (const key of Object.keys(connections)) {
  const value = connections[key];
  const c1 = value[0];
  const c2 = value[1];

  if (
    (sPosition![0] + c1[0] == q1[0] || sPosition![0] + c1[0] == q2[0]) &&
    (sPosition![1] + c1[1] == q1[1] || sPosition![1] + c1[1] == q2[1]) &&
    (sPosition![0] + c2[0] == q1[0] || sPosition![0] + c2[0] == q2[0]) &&
    (sPosition![1] + c2[1] == q1[1] || sPosition![1] + c2[1] == q2[1])
  ) {
    sPipeShape = key;
    console.log("Calculated S pipe shape is", key);
  }
}

while (queue.length) {
  const toCheck = queue.shift()!;
  const currentDistance = visited.get(toCheck)!;

  const connections = connectionMap.get(toCheck)!;

  for (const c of connections) {
    const str = `${c[0]};${c[1]}`;
    if (visited.has(str)) continue;

    queue.push(str);
    visited.set(str, currentDistance + 1);
  }
}

// delete everything thats not in visited
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (!visited.has(`${y};${x}`)) grid[y][x] = " ";
  }
}

// console.log(grid.map((r) => r.join("")).join("\n"));
// iteratively going through grid and incrementing things

// replace S position with pipe as well

let spacesInside = 0;

grid[sPosition![0]][sPosition![1]] = sPipeShape;

for (let y = 0; y < grid.length; y++) {
  let inside = false;
  let lastDirection: number | null = null;

  for (let x = 0; x < grid[y].length; x++) {
    let value = grid[y][x];

    if (value === "|") inside = !inside;

    // if (value === "L" || value === "F") drawingLine = true;

    if (value === "L") {
      lastDirection = 1; // means it came from up;
    }

    if (value === "F") {
      lastDirection = 0; // bottom
    }

    if (value === "7" && lastDirection === 1) {
      inside = !inside;
    }

    if (value === "J" && lastDirection === 0) {
      inside = !inside;
    }

    if (value === " " && inside) {
      spacesInside++;
    }
  }
}

console.log("Spaces inside:", spacesInside);
