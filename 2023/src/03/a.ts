import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const grid = parser.nextUntilEmptyLine()!.map((s) => {
  const arr = s.split("");
  arr.push(".");
  return arr;
});

console.log(grid);

const checkForSymbolsInArea = (
  x1: number,
  x2: number,
  y1: number,
  y2: number
) => {
  if (x1 < 0) x1 = 0;
  if (x2 >= grid[0].length) x2 = grid[0].length - 1;
  if (y1 < 0) y1 = 0;
  if (y2 >= grid.length) y2 = grid.length - 1;

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const value = grid[y][x];

      if (isNaN(+value) && value != ".") return true;
    }
  }

  return false;
};

let sum = 0;

let currentNumber = "";
let currentlyInNumber = false;
let numberCoords = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const value = grid[y][x];

    if (!isNaN(+value) && !currentlyInNumber) {
      currentlyInNumber = true;
      numberCoords.x1 = x;
      numberCoords.y1 = y;
    }

    if (isNaN(+value) && currentlyInNumber) {
      // number ended
      currentlyInNumber = false;

      numberCoords.y2 = y;
      numberCoords.x2 = x - 1;

      let hasSymbol = checkForSymbolsInArea(
        numberCoords.x1 - 1,
        numberCoords.x2 + 1,
        numberCoords.y1 - 1,
        numberCoords.y2 + 1
      );

      console.log("Found number", +currentNumber, hasSymbol);
      if (hasSymbol) sum += +currentNumber;
      currentNumber = "";
    }

    if (currentlyInNumber) currentNumber += value;
  }
}

console.log(sum);
