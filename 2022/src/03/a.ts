import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

// "a".charCodeAt(0) // 97
// "z".charCodeAt(0) // 122
// "A".charCodeAt(0) // 65
// "Z".charCodeAt(0) // 90

let score = 0;

while (inputParser.hasNext()) {
  const line = inputParser.next()!;

  // Parsing the input
  const section1 = line.substring(0, line.length / 2);
  const section2 = line.substring(line.length / 2);

  let charCode = 0;

  for (let char of section2) {
    if (!section1.includes(char)) continue;

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
