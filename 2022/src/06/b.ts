import { InputParser } from "../lib/files";
const parser = new InputParser("in.txt");

const line = parser.next()!;

const last = new Array(14).fill("");

let i = 0;

for (const char of line) {
  i++;
  last.shift();
  last.push(char);

  const s: string[] = [];
  // check for duplicates
  for (const c of last) {
    if (s.includes(c) || c == "") continue;
    else s.push(c);
  }

  if (s.length == last.length) break;
}

console.log(i);
