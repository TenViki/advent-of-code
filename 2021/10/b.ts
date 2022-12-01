import { InputParser } from "../files";

const input = new InputParser("in.txt");

const pointTable = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

let sums = [];

const getSum = (chars: ("]" | "}" | ">" | ")")[]) => {
  let sum = 0;
  chars.forEach((char) => {
    sum *= 5;
    sum += pointTable[char];
  });

  return sum;
};

while (input.hasNext()) {
  const line = input.next()?.split("")!;
  const charStack: ("[" | "{" | "<" | "(")[] = [];

  console.log("READING", line.join(""));

  let wrongFound = false;

  line.forEach((char) => {
    if (wrongFound) return;
    if (char === "[" || char === "{" || char === "<" || char === "(") {
      charStack.push(char);
    }

    if (char === "]") {
      if (charStack[charStack.length - 1] === "[") {
        charStack.pop();
      } else {
        wrongFound = true;
      }
    }

    if (char === "}") {
      if (charStack[charStack.length - 1] === "{") {
        charStack.pop();
      } else {
        wrongFound = true;
      }
    }

    if (char === ">") {
      if (charStack[charStack.length - 1] === "<") {
        charStack.pop();
      } else {
        wrongFound = true;
      }
    }

    if (char === ")") {
      if (charStack[charStack.length - 1] === "(") {
        charStack.pop();
      } else {
        wrongFound = true;
      }
    }
  });

  if (wrongFound) continue;

  const toComplete = charStack.reverse().map((c) => {
    if (c === "[") return "]";
    if (c === "{") return "}";
    if (c === "<") return ">";
    if (c === "(") return ")";
    return ")";
  });

  const sum = getSum(toComplete);
  sums.push(sum);
}

sums.sort((a, b) => a - b);
console.log(sums[Math.floor(sums.length / 2)]);
