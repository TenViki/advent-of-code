import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const grid: number[][] = [];
const visibleTrees = new Set<string>();

while (inputParser.hasNext()) {
  grid.push(inputParser.next()!.split("").map(Number));
}

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  let max = -1;
  for (let x = 0; x < row.length; x++) {
    if (row[x] > max) {
      visibleTrees.add(`${x},${y}`);
      max = row[x];
    }
  }

  max = -1;
  for (let x = row.length - 1; x >= 0; x--) {
    if (row[x] > max) {
      visibleTrees.add(`${x},${y}`);
      max = row[x];
    }
  }
}

for (let x = 0; x < grid[0].length; x++) {
  let max = -1;
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][x] > max) {
      visibleTrees.add(`${x},${y}`);
      max = grid[y][x];
    }
  }

  max = -1;
  for (let y = grid.length - 1; y >= 0; y--) {
    if (grid[y][x] > max) {
      visibleTrees.add(`${x},${y}`);
      max = grid[y][x];
    }
  }
}

console.log("Visible trees: ", visibleTrees.size);
