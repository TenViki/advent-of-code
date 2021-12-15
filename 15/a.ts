import { InputParser } from "../files";

const input = new InputParser("in.txt");

const grid = input
  .getFullInput()
  .split("\r\n")
  .map((row) => row.split("").map(Number));

grid[0][0] = 0;
console.log(grid);

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
