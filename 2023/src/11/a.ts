import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");
let grid = parser.loadAsGrid();

// expand the universe
let newGrid: string[][] = [];

// start with rows
for (let y = 0; y < grid.length; y++) {
  newGrid.push([...grid[y]]);
  if (grid[y].every((r) => r === ".")) {
    newGrid.push(new Array(grid[y].length).fill("."));
  }
}

grid = newGrid;
newGrid = [];

for (let i = 0; i < grid.length; i++) newGrid.push([]);

// expand columns
for (let x = 0; x < grid[0].length; x++) {
  let addNew = grid.every((r) => r[x] === ".");

  for (let y = 0; y < grid.length; y++) {
    newGrid[y].push(grid[y][x]);
    if (addNew) newGrid[y].push(".");
  }
}

grid = newGrid;
newGrid = [];

// expanding complete, create pair and measure distances
const galaxies: [number, number][] = [];

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "#") galaxies.push([y, x]);
  }
}

const distances = new Map<string, number>();

// match every with every
for (const g1 of galaxies) {
  for (const g2 of galaxies) {
    if (g1[0] == g2[0] && g1[1] == g2[1]) continue;

    let key = "";
    if (g1[0] > g2[0]) key = `${g1.join()};${g2.join()}`;
    else if (g2[0] > g1[0]) key = `${g2.join()};${g1.join()}`;
    else {
      if (g1[1] > g2[1]) key = `${g1.join()};${g2.join()}`;
      else key = `${g2.join()};${g1.join()}`;
    }

    if (distances.has(key)) continue;

    distances.set(key, Math.abs(g1[0] - g2[0]) + Math.abs(g1[1] - g2[1]));
  }
}

let sum = 0;

for (const v of distances.values()) {
  sum += v;
}

console.log(sum);
