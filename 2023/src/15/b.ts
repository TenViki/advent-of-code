import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const steps = parser.next()!.split(",");

const boxes = new Map<number, string[]>();

for (const step of steps) {
  let boxIndex = 0;

  let label: string;
  let operation;
  let focalLength: string = "";

  if (step.includes("-")) {
    label = step.substring(0, step.length - 1);
    operation = "-";
  } else {
    [label, focalLength] = step.split("=");
    operation = "=";
  }

  for (const char of label) {
    boxIndex += char.charCodeAt(0);
    boxIndex *= 17;
    boxIndex %= 256;
  }

  let lens: string[] = [];
  if (boxes.has(boxIndex)) lens = boxes.get(boxIndex)!;

  if (operation == "-") {
    // remove the lens
    lens = lens.filter((s) => s.split(" ")[0] != label);
  } else {
    // if there is already lens in this box with the same label
    let index = lens.findIndex((l) => l.split(" ")[0] === label);
    if (index !== -1) {
      lens.splice(index, 1, `${label} ${focalLength}`);
    } else {
      lens.push(`${label} ${focalLength}`);
    }
  }

  boxes.set(boxIndex, lens);
}

let sum = 0;

for (const i of boxes.keys()) {
  let lenses = boxes.get(i)!;

  for (let j = 0; j < lenses.length; j++) {
    const lens = lenses[j];
    const [, focalLength] = lens.split(" ");
    sum += (i + 1) * +focalLength * (j + 1);
  }
}

console.log("Sum", sum);
