import { InputParser } from "../files";

// Parse the input
const input = new InputParser("in.txt");
const [algorithm, data] = input.getFullInput().replaceAll("\r", "").split("\n\n");

let grid = data.split("\n").map((row) => row.split(""));
let environment = ".";

const enlargeGrid = () => {
  grid = [
    [environment, ...new Array(grid[0].length + 1).fill(environment)],
    ...grid.map((row) => [environment, ...row, environment]),
    [environment, ...new Array(grid[0].length + 1).fill(environment)],
  ];
};

let newGrid: string[][] = [];

for (let i = 0; i < 50; i++) {
  enlargeGrid();

  grid.forEach((row, y) => {
    newGrid[y] = [];
    row.forEach((cell, x) => {
      let string = "";
      if (y <= 0 || x <= 0) string += environment;
      else string += grid[y - 1][x - 1];

      if (y <= 0) string += environment;
      else string += grid[y - 1][x];

      if (y <= 0 || x >= grid[0].length - 1) string += environment;
      else string += grid[y - 1][x + 1];

      if (x <= 0) string += environment;
      else string += grid[y][x - 1];

      string += cell;

      if (x >= grid[0].length - 1) string += environment;
      else string += grid[y][x + 1];

      if (y >= grid.length - 1 || x <= 0) string += environment;
      else string += grid[y + 1][x - 1];

      if (y >= grid.length - 1) string += environment;
      else string += grid[y + 1][x];

      if (y >= grid.length - 1 || x >= grid[0].length - 1) string += environment;
      else string += grid[y + 1][x + 1];

      // console.log(string.replaceAll(".", "0").replaceAll("#", "1"));
      newGrid[y].push(algorithm[parseInt(string.replaceAll(".", "0").replaceAll("#", "1"), 2)]);
    });
  });

  grid = newGrid;

  if (environment === "." && algorithm[0] === "#") environment = "#";
  else if (environment === "#" && algorithm[511] === ".") environment = ".";
}

const countLights = () => {
  let count = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell === "#") count++;
    });
  });
  return count;
};

// console.log(algorithm);
console.log("Light pixels:", countLights());
console.log("");
