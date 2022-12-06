import { InputParser } from "../lib/files";
const parser = new InputParser("in.txt");

const line = parser.next()!;

const lastFour = ["", "", "", ""];

let i = 0;

for (const char of line) {
  i++;
  lastFour.shift();
  lastFour.push(char);

  const s: string[] = [];
  // check for duplicates
  for (const c of lastFour) {
    if (s.includes(c) || c == "") continue;
    else s.push(c);
  }

  if (s.length == lastFour.length) break;
}

console.log(i, lastFour);
