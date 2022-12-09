import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const rope = Array.from({ length: 10 }, () => [0, 0]) as [number, number][];

const visitedOne = new Set<string>();
const visitedTwo = new Set<string>();

const updateTailPosition = (
  tailingBlock: [number, number],
  headingBlock: [number, number]
) => {
  const [x, y] = tailingBlock;
  const [xh, yh] = headingBlock;

  if (xh == x && Math.abs(y - yh) > 1) {
    if (yh > y) tailingBlock[1]++;
    else tailingBlock[1]--;
  }

  if (yh == y && Math.abs(x - xh) > 1) {
    if (xh > x) tailingBlock[0]++;
    else tailingBlock[0]--;
  }

  if (xh != x && yh != y && !(Math.abs(x - xh) == 1 && Math.abs(y - yh) == 1)) {
    if (Math.abs(y - yh) == 1) {
      if (xh > x) tailingBlock[0]++;
      else tailingBlock[0]--;
      tailingBlock[1] = yh;
    }

    if (Math.abs(x - xh) == 1) {
      if (yh > y) tailingBlock[1]++;
      else tailingBlock[1]--;
      tailingBlock[0] = xh;
    }
  }

  if (Math.abs(xh - x) == 2 && Math.abs(yh - y) == 2) {
    if (xh > x) tailingBlock[0]++;
    else tailingBlock[0]--;
    if (yh > y) tailingBlock[1]++;
    else tailingBlock[1]--;
  }
};

const printGrid = () => {
  // dymically create grid based on occupied positions
  const minX = Math.min(...rope.map(([x]) => x));
  const maxX = Math.max(...rope.map(([x]) => x));
  const minY = Math.min(...rope.map(([, y]) => y));
  const maxY = Math.max(...rope.map(([, y]) => y));

  const grid = Array.from({ length: maxY - minY + 1 }, () =>
    Array.from({ length: maxX - minX + 1 }, () => ".")
  );

  for (let i = rope.length - 1; i >= 0; i--) {
    const [x, y] = rope[i];
    grid[y - minY][x - minX] = i.toString();
  }

  console.log(grid.map((row) => row.join("")).join("\n"));
  console.log("");
};

while (inputParser.hasNext()) {
  const [direction, distance] = inputParser.next()!.split(" ");

  for (let c = 0; c < +distance; c++) {
    switch (direction) {
      case "R":
        rope[0][0]++;
        break;
      case "L":
        rope[0][0]--;
        break;
      case "U":
        rope[0][1]++;
        break;
      case "D":
        rope[0][1]--;
        break;
    }

    for (let i = 0; i < rope.length - 1; i++) {
      updateTailPosition(rope[i + 1], rope[i]);
      visitedOne.add(rope[9].join(","));
      visitedTwo.add(rope[1].join(","));
    }
  }
}

console.log("Amount of visited positions: " + visitedOne.size, visitedTwo.size);
