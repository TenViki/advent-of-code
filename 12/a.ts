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

  console.log(nodeA, nodeB);

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

console.log(nodes);

const paths: string[][] = [];
paths.push(["start"]);
const completes: string[][] = [];

while (paths.length) {
  const p0 = paths.shift()!;
  for (let s of nodes.find((n) => n.id === p0[p0.length - 1])!.links) {
    if (s.toLowerCase() === s && p0.includes(s)) continue;

    const p1 = [...p0, s];

    if (s === "end") {
      completes.push(p1);
    } else {
      paths.push(p1);
    }
  }
}

console.log(completes.length);
