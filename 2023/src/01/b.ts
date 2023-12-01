import { InputParser } from "../lib/files";

let sum = 0;

const formatNumber = (s: string) => {
  if (s === "one") return 1;
  if (s === "two") return 2;
  if (s === "three") return 3;
  if (s === "four") return 4;
  if (s === "five") return 5;
  if (s === "six") return 6;
  if (s === "seven") return 7;
  if (s === "eight") return 8;
  if (s === "nine") return 9;
  return 0;
};

var re = /(?=(\d{3}))/g;
/    \d{3}  /g;

const parser = new InputParser("input.txt");
while (parser.hasNext()) {
  const string = parser.next()!;

  let number = 0;

  const matches = Array.from(
    string.matchAll(
      /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g
    ),
    (x) => x[1]
  );

  const first = matches[0];
  const last = matches[matches.length - 1];

  number += (isNaN(+first) ? formatNumber(first) : +first) * 10;
  number += isNaN(+last) ? formatNumber(last) : +last;

  sum += number;
}

console.log(sum);
