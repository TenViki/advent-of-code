import { InputParser } from "../files";

const input = new InputParser("in.txt");

const [template, rawInstructions] = input.getFullInput().split("\r\n\r\n");

const instructions = rawInstructions.split("\r\n").map((instruction) => {
  const [from, to] = instruction.split(" -> ");
  return { from, to };
});

const n = 10;
let string = template;

for (let i = 0; i < n; i++) {
  let toReplace = string[0];

  for (let i = 0; i < string.length - 1; i++) {
    const momentaryString = string.substring(i, i + 2);
    const [_, b] = momentaryString.split("");
    const add = instructions.find((instruction) => instruction.from === momentaryString);
    toReplace += add!.to + b;
  }

  string = toReplace;
}

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

let max = 0;
let min = Infinity;

const letters = countLetters(string);
for (const key of Object.keys(letters)) {
  if (letters[key] > max) {
    max = letters[key];
  }
  if (letters[key] < min) {
    min = letters[key];
  }
}

console.log(max - min);
