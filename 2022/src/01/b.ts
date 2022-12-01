import { InputParser } from "../lib/files";

const inputParser = new InputParser("src/01/input.txt");

const elves = [];
let i = 0;

while (inputParser.hasNext()) {
  const number = inputParser.nextNumber();
  if (!number) {
    i++;
  } else {
    if (!elves[i]) elves[i] = 0;
    elves[i] += number;
  }
}

const three_largest = [0, 0, 0];

for (const elf of elves) {
  if (elf > Math.min(...three_largest)) {
    three_largest.push(elf);
    three_largest.sort((a, b) => b - a);
    three_largest.pop();
  }
}

console.log(three_largest.reduce((a, b) => a + b, 0));
