import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

class Node {
  public left: Node | null = null;
  public right: Node | null = null;
  public value: number | null = null;
  public operation: string | null = null;

  constructor(public id: string) {}
}

const monkeys: { [key: string]: string | number } = {};

while (inputParser.hasNext()) {
  const [monkeyId, value] = inputParser
    .next()!
    .split(": ")
    .map((s) => s.trim());

  let v = isNaN(+value) ? value : +value;

  monkeys[monkeyId] = v;
}

const rootNode = new Node("root");

const addToBinaryTree = (node: Node) => {
  const value = monkeys[node.id];
  if (typeof value === "number") {
    if (node.id === "humn") return;

    node.value = +value;
    return;
  }

  const [monkey1, op, monkey2] = value.split(" ");

  node.operation = op;

  node.left = new Node(monkey1);
  node.right = new Node(monkey2);

  addToBinaryTree(node.left);
  addToBinaryTree(node.right);
};

addToBinaryTree(rootNode);

const getNodeValue = (node: Node): number | null => {
  if (node.id === "humn") return null;
  if (node.value) return node.value;

  const v1 = getNodeValue(node.left!);
  const v2 = getNodeValue(node.right!);

  console.log(node.id, v1, v2);
  if (v1 === null || v2 === null) return null;

  if (node.operation === "+") {
    node.value = v1 + v2;
    return v1! + v2!;
  }
  if (node.operation === "-") {
    node.value = v1 - v2;
    return v1! - v2!;
  }
  if (node.operation === "*") {
    node.value = v1 * v2;
    return v1! * v2!;
  }
  if (node.operation === "/") {
    node.value = v1 / v2;
    return v1! / v2!;
  }
  return null;
};

getNodeValue(rootNode);

rootNode.operation = "=";
rootNode.value = rootNode.left!.value || rootNode.right!.value;

const solveForNode = (node: Node) => {
  const value = node.value;
  const left = node.left!;
  const right = node.right!;

  if (node.id === "humn") {
    console.log("HUMN VALUE:", value);
    return;
  }

  if (!left?.value) {
    if (node.operation === "+") {
      left.value = value! - right!.value!;
    }

    if (node.operation === "*") {
      left.value = value! / right!.value!;
    }

    if (node.operation === "-") {
      left.value = value! + right!.value!;
    }

    if (node.operation === "/") {
      left.value = value! * right!.value!;
    }

    if (node.operation === "=") {
      left.value = value!;
    }

    solveForNode(left);
  }

  if (!right?.value) {
    if (node.operation === "+") {
      right.value = value! - left!.value!;
    }

    if (node.operation === "*") {
      right.value = value! / left!.value!;
    }

    if (node.operation === "-") {
      right.value = left!.value! - value!;
    }

    if (node.operation === "/") {
      right.value = left!.value! / value!;
    }

    if (node.operation === "=") {
      left.value = value!;
    }

    solveForNode(right);
  }
};

solveForNode(rootNode);
