import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const toHash = parser.next()!.split(",");

let sum = 0;

for (const str of toHash) {
  let currentValue = 0;

  for (const char of str) {
    currentValue += char.charCodeAt(0);
    currentValue *= 17;
    currentValue %= 256;
  }

  sum += currentValue;
}

console.log(sum);
