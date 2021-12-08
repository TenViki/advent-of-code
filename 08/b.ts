import { InputParser } from "../files";

const input = new InputParser("in.txt");
let numbers = 0;

let topSegment = "";
let middleSegment = "";

const getTopSegment = (values: string[]) => {
  const seven = values.find((str) => str.length == 3)!.split("");
  const one = values.find((str) => str.length == 2)!.split("");

  let segment = "";
  seven.forEach((s) => {
    if (!one.includes(s)) segment = s;
  });

  return segment;
};

const getMiddleSegment = (values: string[], one: string) => {
  const four = values.find((str) => str.length == 4)!.split("");
  let segment = "";
  values.forEach((val) => {
    if (val.length !== 6) return;

    let differs = 0;
    four.forEach((s) => {
      if (one.includes(s)) return;
      if (!val.includes(s)) differs++;
    });

    if (differs === 1) {
      four.forEach((s) => {
        if (!val.includes(s)) segment = s;
      });
    }
  });

  return segment;
};

const getZero = (values: string[]) => {
  let zero = "";
  values.forEach((val) => {
    if (val.length !== 6) return;

    const segments = val.split("");
    if (!segments.includes(middleSegment)) zero = val;
  });

  return zero;
};

const getNine = (values: string[], four: string) => {
  let nine = "";

  values.forEach((val) => {
    if (val.length !== 6) return;

    const segments = val.split("");
    let differs = 0;
    segments.forEach((s) => {
      if (s === topSegment) return;
      if (!four.includes(s)) differs++;
    });

    if (differs === 1) nine = val;
  });

  return nine;
};

const getSix = (values: string[], nine: string, zero: string) => {
  let six = "";
  values.forEach((val) => {
    if (val.length !== 6) return;

    let sortedZero = zero.split("").sort().join("");
    let sortedNine = nine.split("").sort().join("");

    if (val.split("").sort().join("") === sortedZero) return;
    if (val.split("").sort().join("") === sortedNine) return;

    six = val;
  });

  return six;
};

const getFive = (values: string[], six: string) => {
  let five = "";

  values.forEach((val) => {
    if (val.length !== 5) return;

    let differs = 0;

    const segments = val.split("");

    segments.forEach((s) => {
      if (!six.split("").includes(s)) differs++;
    });

    six.split("").forEach((s) => {
      if (!segments.includes(s)) differs++;
    });

    if (differs === 1) five = val;
  });

  return five;
};

const getTwo = (values: string[], four: string) => {
  let two = "";

  values.forEach((val) => {
    if (val.length !== 5) return;

    const segments = val.split("");
    let differs = 0;
    four.split("").forEach((s) => {
      if (!segments.includes(s)) differs++;
    });

    if (differs === 2) two = val;
  });

  return two;
};

const getThree = (values: string[], two: string, five: string) => {
  let three = "";

  values.forEach((val) => {
    if (val.length !== 5) return;

    const sortedTwo = two.split("").sort().join("");
    const sortedFive = five.split("").sort().join("");

    if (val.split("").sort().join("") === sortedTwo) return;
    if (val.split("").sort().join("") === sortedFive) return;

    three = val;
  });

  return three;
};

let sum = 0;
const data = input.getFullInput().split("\r\n");
data.forEach((d) => {
  const [sample, digits] = d.split(" | ");

  const numbers = [...sample.split(" "), ...digits.split(" ")];

  topSegment = getTopSegment(numbers);

  const one = numbers
    .find((str) => str.length == 2)!
    .split("")
    .sort()
    .join("");
  middleSegment = getMiddleSegment(numbers, one);
  const four = numbers
    .find((str) => str.length == 4)!
    .split("")
    .sort()
    .join("");
  const seven = numbers
    .find((str) => str.length == 3)!
    .split("")
    .sort()
    .join("");
  let zero = getZero(numbers).split("").sort().join("");
  let nine = getNine(numbers, four).split("").sort().join("");
  let six = getSix(numbers, nine, zero).split("").sort().join("");
  let five = getFive(numbers, six).split("").sort().join("");
  let two = getTwo(numbers, four).split("").sort().join("");
  let three = getThree(numbers, two, five).split("").sort().join("");

  let number: string[] = [];

  digits.split(" ").forEach((digit) => {
    const digitToCompare = digit.split("").sort().join("");
    if (digitToCompare === zero) number.push("0");
    if (digitToCompare === one) number.push("1");
    if (digitToCompare === two) number.push("2");
    if (digitToCompare === three) number.push("3");
    if (digitToCompare === four) number.push("4");
    if (digitToCompare === five) number.push("5");
    if (digitToCompare === six) number.push("6");
    if (digitToCompare === seven) number.push("7");
    if (digitToCompare.length === 7) number.push("8");
    if (digitToCompare === nine) number.push("9");
  });

  sum += +number.join("");
});

console.log(sum);
