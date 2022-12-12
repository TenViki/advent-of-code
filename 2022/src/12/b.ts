import { exit } from "process";
import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const heightMap: number[][] = [];
let startPos = { x: 0, y: 0 };

let y = 0;

while (inputParser.hasNext()) {
  heightMap.push(
    inputParser
      .next()!
      .split("")
      .map((c, x) => {
        if (c === "E") {
          startPos = { x, y };
          return 27;
        }
        return c.charCodeAt(0) - 96;
      })
  );

  y++;
}

console.log(startPos);

const queue = [
  {
    x: startPos.x,
    y: startPos.y,
    nestage: 0,
  },
];

let final;

const visited: Set<string> = new Set();

const renderGrid = () => {
  // print grid to console with visited positions being marked
  let grid = "";
  for (let y = 0; y < heightMap.length; y++) {
    for (let x = 0; x < heightMap[0].length; x++) {
      if (visited.has(`${x},${y}`)) {
        grid += " X";
      } else {
        let toAdd = heightMap[y][x].toString();
        if (toAdd.length === 1) {
          toAdd = " " + toAdd;
        }
        grid += toAdd;
      }
    }
    grid += "\n";
  }

  console.log(grid);
};

while (queue.length > 0) {
  const position = queue.shift()!;
  const key = `${position.x},${position.y}`;

  if (visited.has(key)) {
    continue;
  }

  visited.add(key);

  if (heightMap[position.y][position.x] === 1) {
    final = position;
    console.log("Reached final position");
    break;
  }

  const currentHeight = heightMap[position.y][position.x];

  if (
    position.y > 0 &&
    currentHeight - heightMap[position.y - 1][position.x] <= 1
  ) {
    queue.push({
      x: position.x,
      y: position.y - 1,
      nestage: position.nestage + 1,
    });
  }

  if (
    position.y < heightMap.length - 1 &&
    currentHeight - heightMap[position.y + 1][position.x] <= 1
  ) {
    queue.push({
      x: position.x,
      y: position.y + 1,
      nestage: position.nestage + 1,
    });
  }

  if (
    position.x > 0 &&
    currentHeight - heightMap[position.y][position.x - 1] <= 1
  ) {
    queue.push({
      x: position.x - 1,
      y: position.y,
      nestage: position.nestage + 1,
    });
  }

  if (
    position.x < heightMap[0].length - 1 &&
    currentHeight - heightMap[position.y][position.x + 1] <= 1
  ) {
    queue.push({
      x: position.x + 1,
      y: position.y,
      nestage: position.nestage + 1,
    });
  }
}

console.log("Steps:", final?.nestage);
