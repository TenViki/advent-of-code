import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const grids = [];
let grid: string[][] = [];

while (parser.hasNext()) {
  const line = parser.next();
  if (line === "") {
    grids.push(grid);
    grid = [];
  } else {
    grid.push(line!.split(""));
  }
}

grids.push(grid);

let sum = 0;

for (const grid of grids) {
  // go iteratively htrough every option
  for (let x = 0; x < grid[0].length - 1; x++) {
    let maxIter = Math.min(x, grid[0].length - x) + 1;
    let rs = 0;

    if (x == 0) maxIter++;

    for (let i = 0; i < maxIter; i++) {
      let c1 = x - i;
      let c2 = x + 1 + i;

      // console.log("Checking column", c1, c2);

      if (c1 < 0 || c2 >= grid[0].length) {
        // console.log("- out of bounds, continue");
        continue;
      }

      // check if two adjecent columns compare

      for (let y = 0; y < grid.length; y++) {
        if (grid[y][c1] !== grid[y][c2]) {
          rs++;
        }
      }
    }

    if (rs === 1) {
      sum += x + 1;
    }
  }

  // go iteratively htrough every option
  for (let y = 0; y < grid.length - 1; y++) {
    let maxIter = Math.min(y, grid.length - y) + 1;
    let rs = 0;

    if (y == 0) maxIter++;

    let rFound = true;
    for (let i = 0; i < maxIter; i++) {
      let r1 = y - i;
      let r2 = y + 1 + i;

      if (r1 < 0 || r2 >= grid.length) continue;

      if (!rFound) break;
      // check if two adjecent columns compare

      for (let x = 0; x < grid[0].length; x++) {
        if (grid[r1][x] !== grid[r2][x]) {
          rs++;
        }
      }
    }

    if (rs === 1) {
      sum += (y + 1) * 100;
    }
  }
}

console.log(sum);
