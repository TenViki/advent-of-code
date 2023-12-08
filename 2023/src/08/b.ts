import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const instructions = parser.next()!;

parser.next();

const nodes: { [id: string]: [string, string] } = {};

while (parser.hasNext()) {
  const [id, left, right] = parser.next()!.match(/[A-Z0-9]{3}/gm)!;
  nodes[id] = [left, right];
}

let startPoints = Object.keys(nodes).filter((s) => s.endsWith("A"));

console.log(startPoints);

let loopSizes: number[] = [];
let cyclesUntilZ = [];

for (const start of startPoints) {
  let currentNode = start;
  let currInstr = 0;
  let zInterval = 0;
  let zFoundAt = 0;
  let counter = 0;

  while (1) {
    let instr = instructions[currInstr];

    if (currentNode.endsWith("Z")) {
      if (zFoundAt) {
        zInterval = counter - zFoundAt;
        break;
      } else zFoundAt = counter;
    }

    // increment node
    if (instr === "L") currentNode = nodes[currentNode][0];
    else currentNode = nodes[currentNode][1];
    currInstr++;
    if (currInstr === instructions.length) currInstr = 0;
    counter++;
  }

  cyclesUntilZ.push(zInterval);
}

let gcf = (a: number, b: number) => {
  while (b != 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }

  return a;
};

let lcm = (a: number, b: number) => {
  return (a / gcf(a, b)) * b;
};

let currentLcm = cyclesUntilZ[0];

for (let i = 1; i < cyclesUntilZ.length; i++) {
  currentLcm = lcm(currentLcm, cyclesUntilZ[i]);
}

console.log("Answer", currentLcm);
