import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

type ConversionObj = {
  min: number;
  max: number;
  shift: number;
}[];

const start = Date.now();

let seedNumbers = parser
  .next()!
  .match(/\d+/gm)!
  .map((x) => parseInt(x));

parser.next();

let ranges: number[][] = [];

let currentRange: number[] = [];
for (const n of seedNumbers) {
  if (currentRange.length === 1) {
    currentRange.push(n + currentRange[0] - 1);
  } else {
    currentRange.push(n);
  }

  if (currentRange.length == 2) {
    ranges.push([...currentRange]);
    currentRange = [];
  }
}

const conversionObjects: ConversionObj[] = [];

console.log(ranges);

while (parser.hasNext()) {
  parser.next(); // skip group name

  const groupData = parser.nextUntilEmptyLine()!;

  const conversionObj: ConversionObj = [];

  for (const record of groupData) {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = record
      .split(" ")
      .map((x) => +x);

    conversionObj.push({
      min: destinationRangeStart,
      max: destinationRangeStart + rangeLength - 1,
      shift: sourceRangeStart - destinationRangeStart,
    });
  }

  conversionObjects.unshift(conversionObj);
}

// console.log(conversionObjects);

let solved = false;
let testedNumber = 0;

while (!solved) {
  let currentValue = testedNumber;

  if (testedNumber % 1_000_000 === 0)
    console.log("Checked", testedNumber, "cases...");

  for (const COs of conversionObjects) {
    for (const co of COs) {
      if (currentValue >= co.min && currentValue <= co.max) {
        currentValue += co.shift;
        break;
      }
    }
  }

  for (const range of ranges) {
    if (currentValue >= range[0] && currentValue <= range[1]) {
      solved = true;
      console.log("Finally here:", testedNumber);
    }
  }

  testedNumber++;
}

console.log("Finished in", Date.now() - start, "ms");
