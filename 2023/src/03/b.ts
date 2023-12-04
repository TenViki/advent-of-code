import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const grid = parser.nextUntilEmptyLine()!.map((s) => {
  const arr = s.split("");
  arr.push(".");
  return arr;
});

const gears: {
  x: number;
  y: number;
  numbers: number[];
}[] = [];

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

      if (isNaN(+value) && value != ".")
        return {
          symbol: value,
          x,
          y,
        };
    }
  }

  return null;
};

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

      let symbol = checkForSymbolsInArea(
        numberCoords.x1 - 1,
        numberCoords.x2 + 1,
        numberCoords.y1 - 1,
        numberCoords.y2 + 1
      );

      if (symbol && symbol.symbol === "*") {
        let existingGear = gears.find(
          (g) => g.x === symbol?.x && g.y === symbol?.y
        );
        if (existingGear) existingGear.numbers.push(+currentNumber);
        else
          gears.push({
            x: symbol.x!,
            y: symbol.y!,
            numbers: [+currentNumber],
          });
      }

      currentNumber = "";
    }
    if (currentlyInNumber) currentNumber += value;
  }
}

console.log(gears);

const sum = gears
  .filter((g) => g.numbers.length === 2)
  .reduce((acc, curr) => curr.numbers[0] * curr.numbers[1] + acc, 0);

console.log(sum);
