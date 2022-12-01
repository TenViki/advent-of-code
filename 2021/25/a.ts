import { InputParser } from "../files";

const input = new InputParser("in.txt");
let grid = input
  .getFullInput()
  .replaceAll("\r", "")
  .split("\n")
  .map((row) => row.split(""));

const moveEast = () => {
  let newGrid = grid.map((row) => row.slice());

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (j === grid[i].length - 1) {
        if (grid[i][j] === ">" && grid[i][0] === ".") {
          newGrid[i][j] = ".";
          newGrid[i][0] = ">";
        }
        continue;
      }

      if (grid[i][j] === "." || grid[i][j] === "v") continue;

      if (grid[i][j + 1] === ">" || grid[i][j + 1] === "v") {
        continue;
      }

      newGrid[i][j] = ".";
      newGrid[i][j + 1] = ">";
    }
  }

  grid = newGrid;
};

const moveSouth = () => {
  let newGrid = grid.map((row) => row.slice());

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (i === grid.length - 1) {
        if (grid[i][j] === "v" && grid[0][j] === ".") {
          newGrid[0][j] = "v";
          newGrid[i][j] = ".";
        }
        continue;
      }

      if (grid[i][j] === "." || grid[i][j] === ">") continue;

      if (grid[i + 1][j] === "v" || grid[i + 1][j] === ">") {
        continue;
      }

      newGrid[i][j] = ".";
      newGrid[i + 1][j] = "v";
    }
  }

  grid = newGrid;
};

const areSame = (oldGrid: string[][], newGrid: string[][]) => {
  for (let i = 0; i < oldGrid.length; i++) {
    for (let j = 0; j < oldGrid[i].length; j++) {
      if (oldGrid[i][j] !== newGrid[i][j]) return false;
    }
  }
  return true;
};

let end = false;
let i = 0;

while (!end) {
  i++;
  let oldGrid = grid.map((row) => row.slice());
  moveEast();
  moveSouth();
  if (areSame(oldGrid, grid)) end = true;
}

console.log(i);
