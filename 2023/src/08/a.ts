import { InputParser } from "../lib/files";

const parser = new InputParser("test.txt");

const instructions = parser.next()!;

parser.next();

const nodes: { [id: string]: [string, string] } = {};

while (parser.hasNext()) {
  const [id, left, right] = parser.next()!.match(/[A-Z]{3}/gm)!;
  nodes[id] = [left, right];
}

let currentInstruction = 0;
let currentNode = "AAA";
let steps = 0;

while (currentNode !== "ZZZ") {
  let instr = instructions[currentInstruction];
  steps++;

  if (instr === "L") currentNode = nodes[currentNode][0];
  else currentNode = nodes[currentNode][1];

  currentInstruction++;
  if (currentInstruction === instructions.length) currentInstruction = 0;
}

console.log("Number of steps:", steps);
