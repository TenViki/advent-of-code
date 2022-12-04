import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

let score = 0;

while (inputParser.hasNext()) {
  const [[idA1, idA2], [idB1, idB2]] = inputParser
    .next()!
    .split(",")
    .map((ids) => ids.split("-").map(Number));

  if ((idA1 <= idB1 && idA2 >= idB2) || (idB1 <= idA1 && idB2 >= idA2)) score++;
}

console.log(score);
