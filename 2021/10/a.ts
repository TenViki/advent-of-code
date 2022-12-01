import { InputParser } from "../files";

const input = new InputParser("in.txt");

const pointTable = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

let sum = 0;

while (input.hasNext()) {
  const line = input.next()?.split("")!;
  const nested = [];
  let currentLevel = 0;
  const charStack: ("[" | "{" | "<" | "(")[] = [];

  console.log("READING", line.join(""));

  let wrongFound = false;

  line.forEach((char) => {
    if (wrongFound) return;
    if (char === "[" || char === "{" || char === "<" || char === "(") {
      charStack.push(char);
      currentLevel++;
      nested.push(currentLevel);
    }

    if (char === "]") {
      if (charStack[charStack.length - 1] === "[") {
        charStack.pop();
        currentLevel--;
      } else {
        sum += pointTable[char];
        wrongFound = true;
      }
    }

    if (char === "}") {
      if (charStack[charStack.length - 1] === "{") {
        charStack.pop();
        currentLevel--;
      } else {
        sum += pointTable[char];
        wrongFound = true;
      }
    }

    if (char === ">") {
      if (charStack[charStack.length - 1] === "<") {
        charStack.pop();
        currentLevel--;
      } else {
        sum += pointTable[char];
        wrongFound = true;
      }
    }

    if (char === ")") {
      if (charStack[charStack.length - 1] === "(") {
        charStack.pop();
        currentLevel--;
      } else {
        sum += pointTable[char];
        wrongFound = true;
      }
    }
  });
}

console.log(sum);
