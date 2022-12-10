import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

let clockCycle = 0;
let currentOperation: string = "";
let currentOperationDuration: number = -1;
let registerValue = 1;

const signalStrengths = [20, 60, 100, 140, 180, 220];
let score = 0;

while (inputParser.hasNext() || currentOperationDuration != 1) {
  clockCycle++;
  if (
    currentOperation == "noop" ||
    (currentOperation.startsWith("addx") && currentOperationDuration == 1) ||
    !currentOperation
  ) {
    // if operation was addx, add the number to register
    if (currentOperation.startsWith("addx")) {
      const number = +currentOperation.split(" ")[1];
      registerValue += number;
    }

    // console.log("Cycle", clockCycle, "- reading next op");

    currentOperation = inputParser.next()!;
    if (currentOperation.startsWith("addx")) currentOperationDuration = 0;
  } else {
    // console.log("Cycle", clockCycle, "continuing addx");
    // current operation is addx but it hasnt finished yet
    currentOperationDuration += 1;
  }

  if (signalStrengths.includes(clockCycle)) {
    console.log("Adding", registerValue, "to score");
    score += registerValue * clockCycle;
  }
}

if (currentOperation.startsWith("addx")) {
  const number = +currentOperation.split(" ")[1];
  registerValue += number;
}

console.log("Register value: ", registerValue);
console.log("Final score:", score);
