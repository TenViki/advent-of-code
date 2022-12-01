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
    debugger;
  }
}

console.log(Math.max(...elves));
