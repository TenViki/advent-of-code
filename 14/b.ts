import { InputParser } from "../files";

const input = new InputParser("in.txt");

const [template, rawInstructions] = input.getFullInput().split("\r\n\r\n");

const instructions = rawInstructions.split("\r\n").map((instruction) => {
  const [from, to] = instruction.split(" -> ");
  return { from, to };
});

const countLetters = (string: string) => {
  const letters: { [k: string]: number } = {};
  for (const letter of string) {
    if (letters[letter]) {
      letters[letter]++;
    } else {
      letters[letter] = 1;
    }
  }
  return letters;
};

const n = 40;

let pairs: { [k: string]: number } = {};
const letters: { [k: string]: number } = countLetters(template);

// Prepare pairs from template
for (let i = 0; i < template.length - 1; i++) {
  const momentaryString = template.substring(i, i + 2);
  if (pairs[momentaryString]) pairs[momentaryString]++;
  else pairs[momentaryString] = 1;
}

console.log(pairs);

for (let i = 0; i < n; i++) {
  const newPairs: { [k: string]: number } = {};

  for (const pair of Object.keys(pairs)) {
    const count = pairs[pair];

    const to = instructions.find((instruction) => instruction.from === pair)!;

    const [a, b] = pair.split("");

    if (newPairs[a + to.to]) {
      newPairs[a + to.to] += count;
    } else {
      newPairs[a + to.to] = count;
    }

    if (newPairs[to.to + b]) {
      newPairs[to.to + b] += count;
    } else {
      newPairs[to.to + b] = count;
    }

    if (letters[to.to]) {
      letters[to.to] += count;
    } else {
      letters[to.to] = count;
    }
  }

  console.log(i, "calculated");

  pairs = newPairs;
}

let max = 0;
let min = Infinity;

console.log(letters);

for (const key of Object.keys(letters)) {
  if (letters[key] > max) {
    max = letters[key];
  }
  if (letters[key] < min) {
    min = letters[key];
  }
}

console.log(max - min);
