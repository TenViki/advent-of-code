import { InputParser } from "../files";

const input = new InputParser("in.txt");

let grid = input
  .getFullInput()
  .split("\r\n")
  .map((row) => row.split("").map(Number));

// grid[0][0] = 0;
const enlargeGrid = () => {
  let newGrid: number[][] = [];

  for (const row of grid) {
    const newRow: number[] = [];
    for (let i = 0; i < 5; i++) {
      row.forEach((cell) => {
        const newCell = cell + i > 9 ? +(cell + i + 1).toString()[(cell + i + 1).toString().length - 1] : cell + i;
        newRow.push(newCell);
      });
    }
    newGrid.push(newRow);
  }

  for (let i = 1; i < 5; i++) {
    for (let j = 0; j < grid.length; j++) {
      const row = newGrid[j];
      const newRow: number[] = [];

      row.forEach((cell) => {
        const newCell = cell + i > 9 ? +(cell + i + 1).toString()[(cell + i + 1).toString().length - 1] : cell + i;
        newRow.push(newCell);
      });

      newGrid.push(newRow);
    }
  }

  return newGrid;
};

grid = enlargeGrid();

const getNeighbors = (x: number, y: number) => {
  const neighbors: number[][] = [];
  if (x > 0) neighbors.push([x - 1, y]);
  if (x < grid.length - 1) neighbors.push([x + 1, y]);
  if (y > 0) neighbors.push([x, y - 1]);
  if (y < grid[0].length - 1) neighbors.push([x, y + 1]);
  return neighbors;
};

const cost = grid.map((row) => row.map(() => Infinity));
cost[0][0] = 0;

const queue = [[0, 0]];
while (queue.length) {
  const current = queue.shift()!;
  const neighbors = getNeighbors(current[0], current[1]);

  for (const neighbor of neighbors) {
    const neighborCost = cost[neighbor[0]][neighbor[1]];
    const costToNeighbor = cost[current[0]][current[1]] + grid[neighbor[0]][neighbor[1]];
    if (neighborCost > costToNeighbor) {
      cost[neighbor[0]][neighbor[1]] = costToNeighbor;
      queue.push(neighbor);
    }
  }
}

console.log(cost[grid.length - 1][grid[0].length - 1]);
