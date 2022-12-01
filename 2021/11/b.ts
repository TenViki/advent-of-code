import { InputParser } from "../files";

const input = new InputParser("in.txt");
const data = input
  .getFullInput()
  .split("\r\n")
  .map((x) => x.split("").map(Number));

const increaseGrid = () => {
  for (let i in data) {
    for (let j in data[i]) {
      // if (data[i][j] === 9) continue;
      data[i][j]++;
    }
  }
};

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const visitedInRound = new Set();

const countNines = () => {
  let count = 0;
  for (let i in data) {
    for (let j in data[i]) {
      if (visitedInRound.has(`${i}-${j}`)) continue;
      if (data[i][j] === 9) count++;
    }
  }
  return count;
};

let flashes = 0;

const checkForFlashes = () => {
  while (countNines()) {
    for (let i in data) {
      for (let j in data[i]) {
        const number = data[i][j];
        if (number === 9) {
          if (visitedInRound.has(`${i}-${j}`)) continue;
          const toCheck = [...directions.map((x) => [x[0] + +i, x[1] + +j])];
          visitedInRound.add(`${i}-${j}`);
          data[i][j] = -1;
          flashes++;
          for (let i in toCheck) {
            const [x, y] = toCheck[i];
            if (!data[x] || data[x][y] === undefined) continue;

            if (visitedInRound.has(`${x}-${y}`)) continue;

            if (data[x][y] === 9) continue;
            if (data[x][y] === -1) continue;

            data[x][y]++;
          }
        }
      }
    }
  }

  visitedInRound.clear();
};

const allZeroes = () => {
  for (let i in data) {
    for (let j in data[i]) {
      if (data[i][j] !== 0) return false;
    }
  }
  return true;
};

// increaseGrid();

let i = 0;
while (true) {
  checkForFlashes();
  increaseGrid();
  i++;
  if (allZeroes()) break;
}

console.log();
console.log(data.map((x) => x.join("")).join("\n"));
console.log("Flashes", flashes);
console.log("All zeroes at", i);
