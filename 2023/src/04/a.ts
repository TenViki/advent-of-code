import { InputParser } from "../lib/files";
const parser = new InputParser("input.txt");

let sum = 0;

while (parser.hasNext()) {
  const line = parser.next()!;

  let score = 0;

  const [, winningStr, inclStr] = line.split(/:|\|/);
  const winning = winningStr
    .split(" ")
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));
  const incl = inclStr
    .split(" ")
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));

  for (let number of winning) {
    if (incl.includes(number)) score ? (score *= 2) : (score = 1);
  }

  sum += score;
}

console.log(sum);
