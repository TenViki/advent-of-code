import { InputParser } from "../files";

const input = new InputParser("in.txt");
const positions = input.getFullInput().split(",").map(Number);
positions.sort((a, b) => a - b);

const getFuel = (delta: number) => {
  let fuel = 0;
  for (let i = 1; i < delta + 1; i++) {
    fuel += i;
  }
  return fuel;
};

let fuels = [];

const min = positions[0];
const max = positions[positions.length - 1];

for (let i = min; i <= max; i++) {
  let sum = 0;
  positions.forEach((position) => {
    sum += getFuel(Math.abs(position - i));
  });

  fuels.push(sum);
}

fuels.sort((a, b) => a - b);
console.log(fuels[0]);
