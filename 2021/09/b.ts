import { InputParser } from "../files";

const input = new InputParser("in.txt");

const grid = input
  .getFullInput()
  .split("\r\n")
  .map((row) => row.split("").map(Number));

const getBesins = (grid: number[][]) => {
  const besins: number[] = [];

  grid.forEach((row, i) => {
    row.forEach((point, j) => {
      let lowest = true;

      if (i > 0 && grid[i - 1][j] <= point) lowest = false;
      if (i < grid.length - 1 && grid[i + 1][j] <= point) lowest = false;

      if (j > 0 && grid[i][j - 1] <= point) lowest = false;
      if (j < grid[i].length - 1 && grid[i][j + 1] <= point) lowest = false;

      if (!lowest) return;

      const visited = new Set();

      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];

      const toCheck = [[i, j]];

      while (toCheck.length) {
        const [i, j] = toCheck.shift()!;

        if (visited.has(`${i}-${j}`)) continue;
        if (i < 0 || j < 0 || i >= grid.length || j >= grid[i].length) continue;
        if (grid[i][j] === 9) continue;

        visited.add(`${i}-${j}`);
        toCheck.push(...directions.map(([x, y]) => [i + x, j + y]));
      }

      besins.push(visited.size);
    });
  });

  return besins;
};

const sorted = getBesins(grid).sort((a, b) => b - a);

console.log(sorted[0] * sorted[1] * sorted[2]);
