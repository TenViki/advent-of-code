import { InputParser } from "../files";

const input = new InputParser("in.txt");

const grid = input
  .getFullInput()
  .split("\r\n")
  .map((row) => row.split("").map(Number));

const getLowPoints = (grid: number[][]) => {
  const lowPoints: number[] = [];

  grid.forEach((row, i) => {
    row.forEach((point, j) => {
      let lowest = true;

      if (i > 0 && grid[i - 1][j] <= point) lowest = false;
      if (i < grid.length - 1 && grid[i + 1][j] <= point) lowest = false;

      if (j > 0 && grid[i][j - 1] <= point) lowest = false;
      if (j < grid[i].length - 1 && grid[i][j + 1] <= point) lowest = false;

      if (lowest) lowPoints.push(point);
    });
  });

  return lowPoints;
};

const lowPoints = getLowPoints(grid);
let risk = 0;

lowPoints.forEach((val) => {
  risk += val + 1;
});

console.log(risk);
