import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

type ArrayType = (ArrayType | number)[];

const compareObjects = (a: ArrayType, b: ArrayType): number => {
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    if (typeof a[i] == "number" && typeof b[i] == "number") {
      if (a[i] < b[i]) return 1;
      if (a[i] > b[i]) return 0;
    }
    let r;
    if (typeof a[i] == "object" && typeof b[i] == "object") {
      r = compareObjects(a[i] as ArrayType, b[i] as ArrayType);
    }

    if (typeof a[i] == "number" && typeof b[i] == "object") {
      r = compareObjects([a[i]], b[i] as ArrayType);
    }

    if (typeof a[i] == "object" && typeof b[i] == "number") {
      r = compareObjects(a[i] as ArrayType, [b[i]]);
    }

    if (r == 1) return 1;
    if (r == 0) return 0;
  }

  if (a.length < b.length) return 1;
  else if (a.length > b.length) return 0;
  else return 2;
};

let i = 0;
let sum = 0;

while (inputParser.hasNext()) {
  const [arr1, arr2] = inputParser
    .nextUntilEmptyLine()!
    .map((s) => eval(s)) as [ArrayType, ArrayType];

  i++;
  const r = compareObjects(arr1, arr2);

  if (r == 1) sum += i;
}

console.log(sum);
