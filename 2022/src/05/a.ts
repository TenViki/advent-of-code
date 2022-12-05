import { InputParser } from "../lib/files";
const parser = new InputParser("in.txt");

const init: string[] = [];
const stacks: string[][] = [];

// parsing the input
while (parser.hasNext()) {
  const line = parser.next();
  if (!line) break;

  init.push(line);
}

init.reverse();

for (let i = 0; i < init[0].length; i++) {
  const c = init[0][i];
  if (c == " ") continue;

  const stack = [];

  for (let j = 1; j < init.length; j++) {
    if (init[j][i] == " ") break;
    stack.push(init[j][i]);
  }

  stacks.push(stack);
}

// doing the actual logic
while (parser.hasNext()) {
  var [howMany, from, to] = parser.next()!.match(/\d+/g)!.map(Number);

  for (let i = 0; i < howMany; i++)
    stacks[to - 1].push(stacks[from - 1].pop()!);
}

console.log("Result:", stacks.map((s) => s[s.length - 1]).join(""));
