import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const AFTER_VAL = 1000000000;

const grid = parser.loadAsGrid();

const moveNorth = () => {
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
};

const moveSouth = () => {
  let movedRocks = -1;
  while (movedRocks != 0) {
    movedRocks = 0;

    for (let y = grid.length - 1; y >= 0; y--) {
      for (let x = 0; x < grid[y].length; x++) {
        let v = grid[y][x];

        if (v !== "O") continue;

        // check if we can move up
        if (y === grid.length - 1) continue;

        if (grid[y + 1][x] === ".") {
          grid[y + 1][x] = "O";
          grid[y][x] = ".";
          movedRocks++;
        }
      }
    }
  }
};

const moveWest = () => {
  let movedRocks = -1;
  while (movedRocks != 0) {
    movedRocks = 0;

    for (let x = 0; x < grid[0].length; x++) {
      for (let y = 0; y < grid.length; y++) {
        let v = grid[y][x];

        if (v !== "O") continue;

        // check if we can move up
        if (x === 0) continue;

        if (grid[y][x - 1] === ".") {
          grid[y][x - 1] = "O";
          grid[y][x] = ".";
          movedRocks++;
        }
      }
    }
  }
};

const moveEast = () => {
  let movedRocks = -1;
  while (movedRocks != 0) {
    movedRocks = 0;

    for (let x = grid[0].length - 1; x >= 0; x--) {
      for (let y = 0; y < grid.length; y++) {
        let v = grid[y][x];

        if (v !== "O") continue;

        // check if we can move up
        if (x === grid[0].length - 1) continue;

        if (grid[y][x + 1] === ".") {
          grid[y][x + 1] = "O";
          grid[y][x] = ".";
          movedRocks++;
        }
      }
    }
  }
};

const scores: number[] = [];
let i = 0;

const checkScoresForCycles = () => {
  for (
    let cycleSize = 2;
    cycleSize < Math.min(20, scores.length);
    cycleSize++
  ) {
    let isCycle = true;
    for (let i = 1; i < cycleSize + 1; i++) {
      let el1 = scores[scores.length - i];
      let el2 = scores[scores.length - i - cycleSize];

      if (el1 != el2) isCycle = false;
    }

    if (!isCycle) continue;

    let cycle = [];
    for (let i = scores.length - cycleSize; i < scores.length; i++) {
      cycle.push(scores[i]);
    }

    return cycle;
  }

  return null;
};

let cycle: number[] | null;

while (true) {
  moveNorth();
  moveWest();
  moveSouth();
  moveEast();

  let score = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "O") score += grid.length - y;
    }
  }
  console.log(score);
  scores.push(score);

  cycle = checkScoresForCycles();
  if (cycle) {
    console.log("Cycle found", cycle);
    break;
  }
}

let cycleStart = scores.length - cycle.length * 2;
let after = AFTER_VAL - cycleStart - 1;

console.log("Value after", cycle[after % cycle.length]);
