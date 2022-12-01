import { InputParser } from "../files";

const input = new InputParser("in.txt");
const positions = input.getFullInput().split(",").map(Number);
positions.sort((a, b) => a - b);

let currentPosition = positions[0];

let fuels = [];

for (let i = 1; i < positions.length; i++) {
  let sum = 0;
  positions.forEach((position) => {
    sum += Math.abs(position - currentPosition);
  });

  fuels.push(sum);
  currentPosition = positions[i];
}

fuels.sort((a, b) => a - b);
console.log(fuels[0]);
