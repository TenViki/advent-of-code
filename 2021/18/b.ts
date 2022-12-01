import { arrayBuffer } from "stream/consumers";
import { InputParser } from "../files";

const input = new InputParser("in.txt");

const countNesting = (input: string[]): number => {
  let nesting = 0;
  let maxNesting = 0;

  for (const char of input) {
    if (char === "[") {
      nesting++;
      maxNesting = Math.max(maxNesting, nesting);
    } else if (char === "]") {
      nesting--;
    }
  }

  return maxNesting;
};

const maxNumber = (input: string[]): number => {
  let max = 0;
  for (const char of input) {
    if (["[", "]", ","].includes(char)) continue;
    max = Math.max(max, parseInt(char));
  }
  return max;
};

const formatNumber = (input: string[]): string[] => {
  let currentNumber = "";
  let string: string[] = [];

  for (const char of input) {
    if (char === "[") {
      if (currentNumber) string.push(currentNumber);
      currentNumber = "";
      string.push("[");
    } else if (char === "]") {
      if (currentNumber) string.push(currentNumber);
      currentNumber = "";
      string.push("]");
    } else if (char === ",") {
      if (currentNumber) string.push(currentNumber);
      currentNumber = "";
      string.push(",");
    } else {
      currentNumber += char;
    }
  }

  return string;
};

let sum: string[] = [];

const addNumbers = (numberA: string[], numberB: string[]) => {
  let sum = ["[", ...numberA, ",", ...numberB, "]"];
  sum = formatNumber(sum);

  while (countNesting(sum) > 4 || maxNumber(sum) >= 10) {
    if (countNesting(sum) > 4) {
      let startPos = 0;
      let endPos = 0;
      let nesting = 0;

      for (const char of sum) {
        startPos++;
        if (char === "[") {
          nesting++;
        } else if (char === "]") {
          nesting--;
        }

        if (nesting === 5) {
          break;
        }
      }

      endPos = startPos + 4;

      const [a, b] = sum
        .slice(startPos - 1, endPos)
        .filter((c) => !["[", "]", ","].includes(c))
        .map(Number);

      for (let i = endPos; i < sum.length; i++) {
        if (["[", "]", ","].includes(sum[i])) continue;

        sum[i] = (b + parseInt(sum[i])).toString();
        break;
      }

      for (let i = startPos - 1; i >= 0; i--) {
        if (["[", "]", ","].includes(sum[i])) continue;

        sum[i] = (a + parseInt(sum[i])).toString();
        break;
      }

      sum.splice(startPos - 1, endPos - startPos + 1);
      sum.splice(startPos - 1, 0, "0");
    } else if (maxNumber(sum) >= 10) {
      let index = 0;
      let number = 0;

      for (let i = 0; i < sum.length; i++) {
        if (["[", "]", ","].includes(sum[i])) continue;

        if (parseInt(sum[i]) >= 10) {
          number = parseInt(sum[i]);
          index = i;
          break;
        }
      }

      sum.splice(index, 1, ...["[", Math.floor(number / 2).toString(), ",", Math.ceil(number / 2).toString(), "]"]);
    }
  }

  return sum;
};

const getMagintude = (string: string[]) => {
  if (string.length === 1) return parseInt(string[0]);

  let nested = 0;
  let first: string[] = [];
  let second: string[] = [];
  let magnitude = 0;

  for (let i = 0; i < string.length; i++) {
    if (string[i] === "[") {
      nested++;
    } else if (string[i] === "]") {
      nested--;
    }
    if (string[i] === "," && nested === 1) {
      first = string.slice(1, i)!;
      second = string.slice(i + 1, string.length - 1)!;
      break;
    }

    if (nested === 0) return i;
  }

  magnitude += getMagintude(first) * 3;
  magnitude += getMagintude(second) * 2;

  return magnitude;
};

const allNumbers: string[][] = [];

console.log(addNumbers("[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]".split(""), "[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]".split("")));

while (input.hasNext()) {
  allNumbers.push(input.next()!.split(""));
}

let maxMagnitude = 0;

for (let i = 0; i < allNumbers.length; i++) {
  for (let j = 0; j < allNumbers.length; j++) {
    if (j === i) continue;
    const sum = addNumbers(allNumbers[i], allNumbers[j]);
    const magnitude = getMagintude(sum);

    if (magnitude > maxMagnitude) {
      maxMagnitude = magnitude;
    }

    console.log("Added", i, j, "magnitude:", magnitude);
  }
}

console.log("Max magnitude:", maxMagnitude);

// console.log();
// console.log("Final result:", sum.join(""));
// console.log("Final result:", sum.join(""));
// console.log("Magnitude", getMagintude(sum));
