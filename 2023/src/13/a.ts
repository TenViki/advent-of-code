import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const grids = [];
let grid: string[][] = [];

while (parser.hasNext()) {
  const line = parser.next();
  console.log(line);
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
  let reflectionFound = false;

  console.log("");

  // go iteratively htrough every option
  for (let x = 0; x < grid[0].length - 1; x++) {
    let maxIter = Math.min(x, grid[0].length - x) + 1;

    if (reflectionFound) break;

    if (x == 0) maxIter++;

    let rFound = true;
    for (let i = 0; i < maxIter; i++) {
      let c1 = x - i;
      let c2 = x + 1 + i;

      // console.log("Checking column", c1, c2);

      if (c1 < 0 || c2 >= grid[0].length) {
        // console.log("- out of bounds, continue");
        continue;
      }

      if (!rFound) break;
      // check if two adjecent columns compare

      for (let y = 0; y < grid.length; y++) {
        if (grid[y][c1] !== grid[y][c2]) {
          rFound = false;
          break;
        }
      }
    }

    if (rFound) {
      // console.log("Found reflection at", x);
      reflectionFound = true;
      sum += x + 1;
    }
  }

  if (reflectionFound) continue;

  // go iteratively htrough every option
  for (let y = 0; y < grid.length - 1; y++) {
    let maxIter = Math.min(y, grid.length - y) + 1;

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
          rFound = false;
          break;
        }
      }
    }

    if (rFound) {
      reflectionFound = true;
      sum += (y + 1) * 100;
    }
  }
}

console.log(sum);
