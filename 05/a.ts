import { InputParser } from "../files";

const input = new InputParser("in.txt");
let data = input
  .getFullInput()
  .split("\r\n")
  .map((s) => s.split(" -> ").map((s) => s.split(",").map(Number)));

data = data.filter((d) => d[0][0] === d[1][0] || d[0][1] === d[1][1]);

let grid: string[][] = [];

const maxX = Math.max(
  ...data.map((d) => (d[0][0] > d[0][1] ? d[0][0] : d[0][1]))
);

const maxY = Math.max(
  ...data.map((d) => (d[1][0] > d[1][1] ? d[1][0] : d[1][1]))
);

grid = new Array(maxX + 1).fill(0).map(() => new Array(maxY + 1).fill("."));
data.forEach((record, i) => {
  const [[x1, y1], [x2, y2]] = record;
  for (let x = x1 < x2 ? x1 : x2; x2 > x1 ? x <= x2 : x <= x1; x++) {
    for (let y = y1 < y2 ? y1 : y2; y2 > y1 ? y <= y2 : y <= y1; y++) {
      if (grid[y][x] === "x" || grid[y][x] === "I") {
        grid[y][x] = "I";
        continue;
      }
      grid[y][x] = "x";
    }
  }
});

const Is = grid.reduce((acc, row) => {
  return (
    acc +
    row.reduce((acc, cell) => {
      return acc + (cell === "I" ? 1 : 0);
    }, 0)
  );
}, 0);

console.log(Is);
