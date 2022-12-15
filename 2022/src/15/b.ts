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

let px = 0;
let py = 0;

let n = filename === "test.txt" ? 20 : 4000000;

for (let row = 0; row <= n; row++) {
  let xskips: [number, number][] = [];

  for (const sensor of sensors) {
    let distFromRow = Math.abs(sensor.y - row);
    let deltaX = sensor.range - distFromRow;

    if (deltaX <= 0) continue;

    const sensorSkip: [number, number] = [
      Math.max(sensor.x - deltaX, 0),
      Math.min(sensor.x + deltaX, n),
    ];

    xskips.push(sensorSkip);
  }

  let start = 0;
  let endsAt = 0;
  let alreadyDone = [];

  while (1) {
    const c = xskips.find((x, i) => {
      let arrStart = x[0];
      let arrEnd = x[1];

      if (arrStart - 1 <= start && start < arrEnd) {
        start = arrEnd;
        endsAt = arrEnd;
        return true;
      }

      return false;
    });

    if (!c) break;
  }

  if (start !== n) {
    px = start + 1;
    py = row;
    break;
  }
}

// for (let y = 0; y <= 4000000; y++) {
//   console.log("y:", y);
//   for (let x = 0; x <= 4000000; x++) {
//     let skip = false;

//     for (const sensor of sensors) {
//       if (x === sensor.closestBeacon.x && y === sensor.closestBeacon.y) {
//         skip = true;
//         break;
//       }
//     }

//     if (skip) {
//       continue;
//     }

//     for (const sensor of sensors) {
//       if (Math.abs(x - sensor.x) + Math.abs(y - sensor.y) > sensor.range) {
//         skip = true;
//         break;
//       }
//     }

//     px = x;
//     py = y;
//   }
// }

console.log("only frequency available:", px * 4000000 + py);
