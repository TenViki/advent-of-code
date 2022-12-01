import { InputParser } from "../files";

const input = new InputParser("in.txt");

interface Node {
  id: string;
  goTo: number[];
  links: string[];
}

const nodes: Node[] = [];

while (input.hasNext()) {
  const line = input.next()!;
  const [nodeA, nodeB] = line.split("-");

  const nodeAIndex = nodes.findIndex((n) => n.id === nodeA);
  const nodeBIndex = nodes.findIndex((n) => n.id === nodeB);

  console.log(nodeAIndex, nodeBIndex);

  if (nodeAIndex === -1) {
    nodes.push({
      id: nodeA,
      goTo: [0],
      links: [nodeB],
    });
  }
  if (nodeBIndex === -1) {
    nodes.push({
      id: nodeB,
      goTo: [0],
      links: [nodeA],
    });
  }

  if (nodeAIndex !== -1) {
    nodes[nodeAIndex].links.push(nodeB);
  }

  if (nodeBIndex !== -1) {
    nodes[nodeBIndex].links.push(nodeA);
  }
}

const count = (array: any[]) => {
  const elements: { [k: string]: number } = {};
  for (const element of array) {
    if (!elements[element]) {
      elements[element] = 0;
    }
    elements[element]++;
  }

  return elements;
};

const paths: string[][] = [];
paths.push(["start"]);
const completes: string[][] = [];

while (paths.length) {
  const p0 = paths.shift()!;
  for (let s of nodes.find((n) => n.id === p0[p0.length - 1])!.links) {
    if (s === "start") continue;

    if (s.toLowerCase() === s) {
      const c = p0.filter((id) => id.toLowerCase() === id);
      if (Object.values(count(c)).includes(2) && p0.includes(s)) continue;
    }

    const p1 = [...p0, s];

    if (s === "end") {
      completes.push(p1);
    } else {
      paths.push(p1);
    }
  }
}

console.log(completes.length);
