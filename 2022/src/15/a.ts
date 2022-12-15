import { InputParser } from "../lib/files";

let filename = "in.txt";
const inputParser = new InputParser(filename);

interface Sensor {
  x: number;
  y: number;
  range: number;
  closestBeacon: {
    x: number;
    y: number;
  };
}

let minX = Infinity;
let maxX = -Infinity;

const sensors: Sensor[] = [];

while (inputParser.hasNext()) {
  const [x, y, xb, yb] =
    inputParser
      .next()
      ?.match(/(-)*\d+/g)
      ?.map(Number) ?? [];

  minX = Math.min(minX, x, xb);
  maxX = Math.max(maxX, x, xb);

  sensors.push({
    x,
    y,
    range: Math.abs(x - xb) + Math.abs(y - yb),
    closestBeacon: {
      x: xb,
      y: yb,
    },
  });
}

let y = filename === "test.txt" ? 10 : 2000000;
let avalPos = 0;

let maxRange = Math.max(...sensors.map((s) => s.range));

for (let x = minX - maxRange * 2; x <= maxX + maxRange * 2; x++) {
  let skip = false;
  for (const sensor of sensors) {
    if (x === sensor.closestBeacon.x && y === sensor.closestBeacon.y) {
      skip = true;
      break;
    }
  }

  if (skip) {
    continue;
  }

  for (const sensor of sensors) {
    if (Math.abs(x - sensor.x) + Math.abs(y - sensor.y) <= sensor.range) {
      avalPos++;
      break;
    }
  }
}

console.log("positions not available:", avalPos);
