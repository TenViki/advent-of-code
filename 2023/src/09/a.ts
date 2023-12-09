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
  sequences[sequences.length - 1].push(0);

  for (let i = sequences.length - 2; i >= 0; i--) {
    let newNum = sequences[i].at(-1)! + sequences[i + 1].at(-1)!;

    sequences[i].push(newNum);
  }

  sum += sequences[0].at(-1)!;
}

console.log("Sum:", sum);
