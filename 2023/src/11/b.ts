import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");
let expansionFactor = 1_000_000;
let grid = parser.loadAsGrid();

const galaxies: [number, number][] = [];

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "#") galaxies.push([y, x]);
  }
}

let maxY = Math.max(...galaxies.map((g) => g[0]));
let maxX = Math.max(...galaxies.map((g) => g[1]));

// decrease expansionFactor - 1 because it the space there already stays
expansionFactor--;

// expanding universe just by working with galaxies like this;
for (let y = 0; y < maxY; y++) {
  // if there are galaxies in this row, continue;
  if (galaxies.find((g) => g[0] == y)) continue;

  // if not, push all galaxies after this point {expansionFactor} down
  // update maxY as well

  for (const galaxy of galaxies) {
    if (galaxy[0] > y) galaxy[0] += expansionFactor;
  }

  maxY += expansionFactor;

  // skip all the new created space
  y += expansionFactor;
}

// do the same thing with x
for (let x = 0; x < maxX; x++) {
  if (galaxies.find((g) => g[1] == x)) continue;

  for (const galaxy of galaxies) {
    if (galaxy[1] > x) galaxy[1] += expansionFactor;
  }

  maxX += expansionFactor;
  x += expansionFactor;
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

console.log(sum, distances.size);
