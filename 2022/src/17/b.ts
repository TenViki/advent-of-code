import { InputParser } from "../lib/files";

const inputParser = new InputParser("test.txt");
const gasMoves = inputParser.next()!.trim().split("");

const rockShapes = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
    [1, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
];

let maxHeight = -1;
let rocks = new Set<string>();
let gasCounter = 0;

const renderGrid = (
  rockShape: [number, number][],
  rockPosition: [number, number]
) => {
  for (let y = maxHeight + 6; y >= 0; y--) {
    let str = "";

    for (let x = 0; x < 7; x++) {
      if (rocks.has(`${x},${y}`)) str += "#";
      else str += ".";
    }

    console.log(str);
  }
};

let cycles = 1_000_000_000_000;
// let cycles = 2022;
for (let i = 0; i < cycles; i++) {
  if (i % 100_000 == 0) console.log(i, "done", i / cycles, "%");

  const rockShape = rockShapes[i % rockShapes.length];
  let rockPosition = [2, maxHeight + 4];

  while (1) {
    // Start of gas movement part
    const gasMovement = gasMoves[gasCounter % gasMoves.length];
    gasCounter++;

    let lastValidPosition = [...rockPosition];

    if (gasMovement === ">") {
      rockPosition = [rockPosition[0] + 1, rockPosition[1]];
    } else if (gasMovement === "<") {
      rockPosition = [rockPosition[0] - 1, rockPosition[1]];
    }

    let valid = true;

    for (const partRock of rockShape) {
      const [x, y] = partRock;

      let str = `${x + rockPosition[0]},${y + rockPosition[1]}`;
      if (
        x + rockPosition[0] > 6 ||
        rockPosition[0] + x < 0 ||
        rocks.has(str)
      ) {
        valid = false;
        break;
      }
    }

    if (!valid) {
      rockPosition = [...lastValidPosition];
    }

    // Start of gravity part
    valid = true;
    lastValidPosition = [...rockPosition];
    rockPosition = [rockPosition[0], rockPosition[1] - 1];

    for (const partRock of rockShape) {
      const [x, y] = partRock;

      if (y + rockPosition[1] < 0) valid = false;

      const str = `${x + rockPosition[0]},${y + rockPosition[1]}`;

      if (rocks.has(str)) valid = false;
    }

    if (!valid) {
      for (const partRock of rockShape) {
        const [x, y] = partRock;

        maxHeight = Math.max(maxHeight, y + lastValidPosition[1]);

        const str = `${x + lastValidPosition[0]},${y + lastValidPosition[1]}`;
        rocks.add(str);
      }

      break;
    }
  }

  if (i % 1000 == 0) {
    const topVals = new Set<string>();
    let wasEverywhere = new Array(7).fill(false);

    for (let y = maxHeight; y >= 0; y--) {
      for (let x = 0; x < 7; x++) {
        if (rocks.has(`${x},${y}`)) {
          topVals.add(`${x},${y}`);
          wasEverywhere[x] = true;
        }
      }

      if (wasEverywhere.every((v) => v)) break;
    }

    rocks.clear();
    rocks = new Set(topVals);
  }
}

let maxY = 0;

for (const rockVal of [...rocks.values()]) {
  const [x, y] = rockVal.split(",").map(Number);
  maxY = Math.max(y, maxY);
}

console.log("Tower height:", maxY + 1);
