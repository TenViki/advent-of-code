import { InputParser } from "../files";

const input = new InputParser("in.txt");
const data = input
  .getFullInput()
  .replaceAll("..", ",")
  .replaceAll("target area: x=", "")
  .replaceAll(" ", "")
  .replaceAll("y=", "")
  .split(",")
  .map(Number);

const targetStart = [data[0], data[2]];
const targetEnd = [data[1], data[3]];

const doesTrajectoryCrossTarget = (vX: number, vY: number): [boolean, number, boolean, boolean] => {
  let x = 0;
  let y = 0;
  let result = undefined;
  let maxY = 0;

  let failsX = false;
  let failsY = false;

  let velY = vY;
  let velX = vX;

  while (result === undefined) {
    x += velX;
    y += velY;

    if (velX > 0) velX--;
    if (velX < 0) velX++;

    if (y > maxY) maxY = y;

    velY--;

    if (x >= targetStart[0] && x <= targetEnd[0] && y >= targetStart[1] && y <= targetEnd[1]) {
      result = true;
    } else if (x > targetEnd[0]) {
      failsX = true;
      result = false;
    } else if (y < targetStart[1]) {
      failsY = true;
      result = false;
    }
  }

  return [result, maxY, failsY, failsX];
};

// Yep, just bruteforce

let maxY = 0;
let end = false;

for (let i = 0; i < 1000; i++) {
  for (let j = 0; j < 1000; j++) {
    const [crosses, y, failsY, failsX] = doesTrajectoryCrossTarget(i, j);
    if (crosses) {
      console.log(i, j, "hits!", y);
      if (y > maxY) maxY = y;
    }
  }
}

console.log("Max Y:", maxY);
