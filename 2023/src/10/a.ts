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

console.log("Max distance: ", Math.max(...visited.values()));
