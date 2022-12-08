import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const grid: number[][] = [];

while (inputParser.hasNext()) {
  grid.push(inputParser.next()!.split("").map(Number));
}

const getTreeViewScore = (x: number, y: number) => {
  const treeValue = grid[y][x];

  let scoreTop = 0;
  for (let i = y - 1; i >= 0; i--) {
    if (treeValue > grid[i][x]) scoreTop++;
    else {
      scoreTop++;
      break;
    }
  }

  let scoreBottom = 0;
  for (let i = y + 1; i < grid.length; i++) {
    if (treeValue > grid[i][x]) scoreBottom++;
    else {
      scoreBottom++;
      break;
    }
  }

  let scoreLeft = 0;
  for (let i = x - 1; i >= 0; i--) {
    if (treeValue > grid[y][i]) scoreLeft++;
    else {
      scoreLeft++;
      break;
    }
  }

  let scoreRight = 0;
  for (let i = x + 1; i < grid[y].length; i++) {
    if (treeValue > grid[y][i]) scoreRight++;
    else {
      scoreRight++;
      break;
    }
  }

  return scoreTop * scoreBottom * scoreLeft * scoreRight;
};

let max = 0;

// loop through all trees
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const score = getTreeViewScore(x, y);
    if (score > max) max = score;
  }
}

console.log("Max veiwing distance: ", max);
