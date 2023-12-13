import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

let wholeSum = 0;

while (parser.hasNext()) {
  const [string, numStr] = parser.next()!.split(" ");
  let newString = string;
  let newNumbers = numStr;

  for (let i = 0; i < 4; i++) {
    newString += "?" + string;
    newNumbers += "," + numStr;
  }

  const numbers = newNumbers.split(",").map(Number);

  const tryCombination = (str: string): number => {
    if (!str.includes("?")) {
      const s = str.match(/#+/gm);

      if (s?.length !== numbers.length) return 0;

      for (let i = 0; i < s.length; i++) {
        if (s[i].length !== numbers[i]) return 0;
      }

      return 1;
    }

    const version1 = str.replace("?", "#");
    const version2 = str.replace("?", ".");

    return tryCombination(version1) + tryCombination(version2);
  };

  const sum = tryCombination(newString);

  console.log("Done with this", sum);

  wholeSum += sum;
}

console.log("Answer:", wholeSum);
