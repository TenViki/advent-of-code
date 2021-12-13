import { InputParser } from "../files";

const input = new InputParser("in.txt");

const [data, folds] = input.getFullInput().split("\r\n\r\n");
const cords = data.split("\r\n").map((cord) => cord.split(",").map(Number));

const xArray = data.split("\r\n").map((x) => +x.split(",")[0]);
const yArray = data.split("\r\n").map((x) => +x.split(",")[1]);

const xMax = Math.max(...xArray);
const yMax = Math.max(...yArray);

const grid = new Array(yMax + 1)
  .fill(".")
  .map(() => new Array(xMax + 1).fill("."));

for (const cord of cords) {
  const [x, y] = cord;
  grid[y][x] = "#";
}

const removeRows = (from: number, to: number) => {
  grid.splice(from, to + 1);
};

const removeCols = (from: number, to: number) => {
  grid.forEach((row) => row.splice(from, to + 1));
};

for (const fold of folds.split("\r\n")) {
  const [line, value] = fold.split("=");

  if (line.includes("x")) {
    for (let i in grid) {
      for (let j = +value + 1; j < grid[i].length; j++) {
        if (grid[i][j] === "#") {
          grid[i][j] = ".";
          grid[i][+value - (j - +value)] = "#";
        }
      }
    }

    removeCols(+value, grid[0].length - 1);
  } else {
    for (let i = +value + 1; i <= grid.length - 1; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === "#") {
          grid[i][j] = ".";
          grid[+value - (i - +value)][j] = "#";
        }
      }
    }

    removeRows(+value, grid.length - 1);
  }
}

console.log(grid.map((row) => row.join("")).join("\r\n"));
