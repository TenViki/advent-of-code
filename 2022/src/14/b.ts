import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const rockPositions = new Set<string>();

let maxY = 0;

while (inputParser.hasNext()) {
  const pathPoints = inputParser.next()!.split(" -> ");

  for (let i = 0; i < pathPoints.length - 1; i++) {
    const [x1, y1] = pathPoints[i].split(",").map(Number);
    const [x2, y2] = pathPoints[i + 1].split(",").map(Number);

    maxY = Math.max(maxY, y1, y2);

    if (x1 == x2) {
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        rockPositions.add(`${x1},${y}`);
      }
    } else {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
        rockPositions.add(`${x},${y1}`);
      }
    }
  }
}

const sandPositions = new Set<string>();

let end = false;

while (!end) {
  const sand = [500, 0];

  // move sand
  while (!end) {
    const [x, y] = sand;

    if (
      !rockPositions.has(`${x},${y + 1}`) &&
      !sandPositions.has(`${x},${y + 1}`) &&
      y < maxY + 1
    ) {
      sand[1] += 1;
      continue;
    }

    if (
      !rockPositions.has(`${x - 1},${y + 1}`) &&
      !sandPositions.has(`${x - 1},${y + 1}`) &&
      y < maxY + 1
    ) {
      sand[0] -= 1;
      sand[1] += 1;
      continue;
    }

    if (
      !rockPositions.has(`${x + 1},${y + 1}`) &&
      !sandPositions.has(`${x + 1},${y + 1}`) &&
      y < maxY + 1
    ) {
      sand[0] += 1;
      sand[1] += 1;
      continue;
    }

    sandPositions.add(`${x},${y}`);
    break;
  }

  if (sand[0] == 500 && sand[1] == 0) {
    end = true;
  }
}

console.log(sandPositions.size);
