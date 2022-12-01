import { InputParser } from "../files";

const input = new InputParser("in.txt");
let data = input.getFullInput().split("\r\n").map(Number);

let bigger = 0;
let last: number | null = null;

data.forEach((number, index) => {
  if (index >= data.length - 2) return;
  const sum = number + data[index + 1] + data[index + 2];
  if (last !== null && sum > last) {
    bigger++;
  }
  last = sum;
});

console.log(bigger);
