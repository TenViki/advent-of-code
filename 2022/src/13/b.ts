import { InputParser } from "../lib/files";

const inputParser = new InputParser("test.txt");

type ArrayType = (ArrayType | number)[];

const compareObjects = (a: ArrayType, b: ArrayType): number => {
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    if (typeof a[i] == "number" && typeof b[i] == "number") {
      if (a[i] < b[i]) return 1;
      if (a[i] > b[i]) return -1;
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
    if (r == -1) return -1;
  }

  if (a.length < b.length) return 1;
  else if (a.length > b.length) return -1;
  else return 0;
};

let i = 0;

const ds1 = [[2]];
const ds2 = [[6]];
const packets = [ds1, ds2] as ArrayType[];

while (inputParser.hasNext()) {
  const [arr1, arr2] = inputParser
    .nextUntilEmptyLine()!
    .map((s) => eval(s)) as [ArrayType, ArrayType];

  packets.push(arr1, arr2);
}

packets.sort((a, b) => -compareObjects(a, b));

console.log(compareObjects([1, 1, 5, 1, 1], [[1], [2, 3, 4]]));
console.log(packets);

console.log((packets.indexOf(ds1) + 1) * (packets.indexOf(ds2) + 1));
