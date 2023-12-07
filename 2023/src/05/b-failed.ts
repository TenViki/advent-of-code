import { exit } from "process";
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

let ranges: number[][] = [];

let currentRange: number[] = [];
for (const n of seedNumbers) {
  // if (currentRange.length !== 1) {
  //   currentRange = [n];
  // } else {
  //   currentRange.push(n);
  //   ranges.push([...currentRange]);
  //   currentRange = [];
  // }

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

console.log(ranges);

const shiftNumber = (co: ConversionObj, number: number) => {
  for (const record of co) {
    if (number >= record.min && number <= record.max) {
      return number + record.shift;
    }
  }

  return number;
};

// console.log("original", seedNumbers);

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

  conversionObj.sort((a, b) => a.min - b.min);

  console.log(conversionObj);

  let newRanges = [];

  for (const range of ranges) {
    // if the range is bigger then one in conversion thing, we need to split it

    let rangeStart = range[0];
    let rangeEnd = range[1];

    const subRangesOriginal: number[][] = [];
    const subRanges: number[][] = [];

    for (const co of conversionObj) {
      // if co max is in range
      if (co.max >= rangeStart && co.max <= rangeEnd && co.min < rangeStart) {
        subRanges.push([rangeStart + co.shift, co.max + co.shift]);
        if (rangeStart + co.shift === 0) {
          console.log("Thats not right 1");
        }
        subRangesOriginal.push([rangeStart, co.max]);
        continue;
      }

      // if co min is in range but not max
      if (co.min >= rangeStart && co.min <= rangeEnd && co.max > rangeEnd) {
        subRanges.push([co.min + co.shift, rangeEnd + co.shift]);
        if (co.min + co.shift === 0) {
          console.log("Thats not right 2", co, rangeStart, rangeEnd);
        }
        subRangesOriginal.push([co.min, rangeEnd]);
        continue;
      }

      // if the whole thing is inside
      if (
        co.min >= rangeStart &&
        co.min <= rangeEnd &&
        co.max >= rangeStart &&
        co.min <= rangeEnd
      ) {
        subRanges.push([co.min + co.shift, co.max + co.shift]);
        subRangesOriginal.push([co.min, co.max]);

        if (co.min + co.shift === 0) {
          console.log("Thats not right 3", co, rangeStart, rangeEnd);
        }

        continue;
      }

      // if the whole thing is outside
      if (co.min <= rangeStart && co.max >= rangeEnd) {
        subRanges.push([rangeStart + co.shift, rangeEnd + co.shift]);

        if (rangeStart + co.shift === 0) {
          console.log("Thats not right 4");
        }

        subRangesOriginal.push([rangeStart, rangeEnd]);
      }
    }

    // now we need to correct the holes
    let shouldStartAt = rangeStart;
    let shouldEndAt = rangeEnd;

    if (subRangesOriginal.length === 0) {
      // if there are no new generated ranges in this range
      subRanges.push([shouldStartAt, shouldEndAt]);
    } else {
      // if there is at least one new change
      subRangesOriginal.sort((a, b) => a[0] - b[0]);

      for (const range of subRangesOriginal) {
        if (range[0] != shouldStartAt) {
          subRanges.push([shouldStartAt, range[0] - 1]);
          shouldStartAt = range[1] + 1;
        }
      }

      // get the last range
      // console.log(subRangesOriginal);
      const lastRange = subRangesOriginal.at(-1)!;
      if (lastRange[1] != shouldEndAt)
        subRanges.push([lastRange[1] + 1, shouldEndAt]);
    }
    newRanges.push(...subRanges);
  }

  // console.log("New ranges", newRanges);

  ranges = newRanges;
}

console.log("this is the result of this torture:", Math.min(...ranges.flat()));
