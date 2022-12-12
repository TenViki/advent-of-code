import { exit } from "process";
import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const heightMap: number[][] = [];
let startPos = { x: 0, y: 0 };
let endPos = { x: 0, y: 0 };

let y = 0;

while (inputParser.hasNext()) {
  heightMap.push(
    inputParser
      .next()!
      .split("")
      .map((c, x) => {
        if (c === "S") {
          startPos = { x, y };
          return 0;
        }
        if (c === "E") {
          endPos = { x, y };
          return 27;
        }
        return c.charCodeAt(0) - 96;
      })
  );

  y++;
}

console.log(startPos);
console.log(endPos);

const queue = [
  {
    x: startPos.x,
    y: startPos.y,
    nestage: 0,
  },
];

let final;

const visited: Set<string> = new Set();

while (queue.length > 0) {
  const position = queue.shift()!;
  const key = `${position.x},${position.y}`;

  if (visited.has(key)) {
    continue;
  }

  visited.add(key);

  if (position.x === endPos.x && position.y === endPos.y) {
    final = position;
    console.log("Reached final position");
    break;
  }

  const currentHeight = heightMap[position.y][position.x];

  if (
    position.y > 0 &&
    heightMap[position.y - 1][position.x] - currentHeight <= 1
  ) {
    queue.push({
      x: position.x,
      y: position.y - 1,
      nestage: position.nestage + 1,
    });
  }

  if (
    position.y < heightMap.length - 1 &&
    heightMap[position.y + 1][position.x] - currentHeight <= 1
  ) {
    queue.push({
      x: position.x,
      y: position.y + 1,
      nestage: position.nestage + 1,
    });
  }

  if (
    position.x > 0 &&
    heightMap[position.y][position.x - 1] - currentHeight <= 1
  ) {
    queue.push({
      x: position.x - 1,
      y: position.y,
      nestage: position.nestage + 1,
    });
  }

  if (
    position.x < heightMap[0].length - 1 &&
    heightMap[position.y][position.x + 1] - currentHeight <= 1
  ) {
    queue.push({
      x: position.x + 1,
      y: position.y,
      nestage: position.nestage + 1,
    });
  }
}

console.log("Steps:", final?.nestage);
