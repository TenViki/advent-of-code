import { InputParser } from "../lib/files";

let sum = 0;

const parser = new InputParser("input.txt");
while (parser.hasNext()) {
  const string = parser.next()!;

  let number = 0;

  for (let i = 0; i < string.length; i++) {
    if (!isNaN(+string[i])) {
      number += +string[i] * 10;
      break;
    }
  }

  for (let i = string.length - 1; i >= 0; i--) {
    if (!isNaN(+string[i])) {
      number += +string[i];
      break;
    }
  }

  sum += number;
}

console.log(sum);
