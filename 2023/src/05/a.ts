import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

type ConversionObj = {
  min: number;
  max: number;
  shift: number;
}[];

let seedNumbers = parser
  .next()!
  .match(/\d+/gm)!
  .map((x) => parseInt(x));

parser.next();

const shiftNumber = (co: ConversionObj, number: number) => {
  for (const record of co) {
    if (number >= record.min && number <= record.max) {
      return number + record.shift;
    }
  }

  return number;
};

console.log("original", seedNumbers);

while (parser.hasNext()) {
  const groupName = parser.next(); // skip group name

  const groupData = parser.nextUntilEmptyLine()!;

  const conversionObj: ConversionObj = [];

  for (const record of groupData) {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = record
      .split(" ")
      .map((x) => +x);

    conversionObj.push({
      min: sourceRangeStart,
      max: sourceRangeStart + rangeLength - 1,
      shift: destinationRangeStart - sourceRangeStart,
    });
  }

  const newSeedNumbers = [];

  for (const number of seedNumbers) {
    newSeedNumbers.push(shiftNumber(conversionObj, number));
  }

  seedNumbers = newSeedNumbers;

  console.log(groupName, newSeedNumbers);
}

console.log("minimum:", Math.min(...seedNumbers));
