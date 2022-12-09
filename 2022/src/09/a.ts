import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const headPosition = [0, 0];
const tailPosition = [0, 0];
const visited = new Set<string>();

const updateTailPosition = () => {
  const [x, y] = tailPosition;
  const [xh, yh] = headPosition;

  if (xh == x && Math.abs(y - yh) > 1) {
    if (yh > y) tailPosition[1]++;
    else tailPosition[1]--;
  }

  if (yh == y && Math.abs(x - xh) > 1) {
    if (xh > x) tailPosition[0]++;
    else tailPosition[0]--;
  }

  if (xh != x && yh != y && !(Math.abs(x - xh) == 1 && Math.abs(y - yh) == 1)) {
    if (Math.abs(y - yh) == 1) {
      if (xh > x) tailPosition[0]++;
      else tailPosition[0]--;
      tailPosition[1] = yh;
    }

    if (Math.abs(x - xh) == 1) {
      if (yh > y) tailPosition[1]++;
      else tailPosition[1]--;
      tailPosition[0] = xh;
    }
  }

  visited.add(tailPosition.join(","));
};

while (inputParser.hasNext()) {
  const [direction, distance] = inputParser.next()!.split(" ");

  for (let c = 0; c < +distance; c++) {
    switch (direction) {
      case "R":
        headPosition[0]++;
        break;
      case "L":
        headPosition[0]--;
        break;
      case "U":
        headPosition[1]++;
        break;
      case "D":
        headPosition[1]--;
        break;
    }

    updateTailPosition();
  }
}

console.log("Amount of visited positions: " + visited.size);
