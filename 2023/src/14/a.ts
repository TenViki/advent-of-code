import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const grid = parser.loadAsGrid();

let movedRocks = -1;

while (movedRocks != 0) {
  movedRocks = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let v = grid[y][x];

      if (v !== "O") continue;

      // check if we can move up
      if (y === 0) continue;

      if (grid[y - 1][x] === ".") {
        grid[y - 1][x] = "O";
        grid[y][x] = ".";
        movedRocks++;
      }
    }
  }
}

let score = 0;

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "O") score += grid.length - y;
  }
}

console.log("Total load", score);
