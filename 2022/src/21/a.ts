import { InputParser } from "../lib/files";

const inputParser = new InputParser("in.txt");

const monkeys: { [key: string]: string | number } = {};

while (inputParser.hasNext()) {
  const [monkeyId, value] = inputParser
    .next()!
    .split(": ")
    .map((s) => s.trim());

  let v = isNaN(+value) ? value : +value;

  monkeys[monkeyId] = v;
}

const getValueOfMonkey = (id: string): number => {
  const value = monkeys[id];
  if (typeof value === "number") {
    return +value;
  }

  const [monkey1, op, monkey2] = value.split(" ");

  const v1 = getValueOfMonkey(monkey1);
  const v2 = getValueOfMonkey(monkey2);

  if (op === "+") return v1 + v2;
  if (op === "-") return v1 - v2;
  if (op === "*") return v1 * v2;
  if (op === "/") return v1 / v2;
  return 0;
};

console.log(getValueOfMonkey("root"));
