import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

let sum = 0;

while (parser.hasNext()) {
  const arr = parser.nextNumberArray()!;
  const sequences = [arr];

  let ind = 0;

  while (!sequences[sequences.length - 1].every((s) => s === 0)) {
    let currentSequence = sequences[ind];
    ind++;

    let newSequence: number[] = [];
    for (let i = 1; i < currentSequence.length; i++) {
      newSequence.push(currentSequence[i] - currentSequence[i - 1]);
    }

    sequences.push(newSequence);
  }

  // work our way up
  sequences[sequences.length - 1].unshift(0);

  for (let i = sequences.length - 2; i >= 0; i--) {
    let newNum = sequences[i][0] - sequences[i + 1][0];

    sequences[i].unshift(newNum);
  }

  sum += sequences[0][0];
}

console.log("Sum:", sum);
