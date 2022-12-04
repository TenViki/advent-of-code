import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

// "a".charCodeAt(0) // 97
// "z".charCodeAt(0) // 122
// "A".charCodeAt(0) // 65
// "Z".charCodeAt(0) // 90

let score = 0;

while (inputParser.hasNext()) {
  const group: string[] = [];

  for (let i = 0; i < 3; i++) group.push(inputParser.next()!);

  let charCode = 0;

  for (const char of group[0]) {
    if (!group.every((t) => t.includes(char))) continue;

    charCode = char.charCodeAt(0);
    break;
  }

  if (charCode >= 97 && charCode <= 122) {
    score += charCode - 96;
  } else if (charCode >= 65 && charCode <= 90) {
    score += charCode - 38;
  }
}

console.log(score);
