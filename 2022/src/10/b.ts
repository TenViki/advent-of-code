import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

let clockCycle = 0;
let currentOperation: string = "";
let currentOperationDuration: number = -1;
let registerValue = 1;

const crt = ["", "", "", "", "", ""];

while (inputParser.hasNext()) {
  if (clockCycle >= 240) break;
  const crtRow = Math.floor(clockCycle / 40);
  if (Math.abs(registerValue - (clockCycle % 40)) <= 1) crt[crtRow] += "#";
  else crt[crtRow] += ".";

  clockCycle++;

  if (
    currentOperation == "noop" ||
    (currentOperation.startsWith("addx") && currentOperationDuration == 1) ||
    !currentOperation
  ) {
    currentOperation = inputParser.next()!;
    if (currentOperation.startsWith("addx")) currentOperationDuration = 0;
  } else {
    // current operation is addx but it hasnt finished yet
    currentOperationDuration += 1;

    const number = +currentOperation.split(" ")[1];
    registerValue += number;
  }
}

if (currentOperation.startsWith("addx")) {
  const number = +currentOperation.split(" ")[1];
  registerValue += number;
}

console.log("Rendered image: ");
console.log(
  crt.map((s) => s.replaceAll("#", "██").replaceAll(".", "  ")).join("\n")
);
