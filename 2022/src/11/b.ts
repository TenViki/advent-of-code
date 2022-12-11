import { InputParser } from "../lib/files";

interface Monkey {
  items: number[];
  operation: {
    operation: string;
    value1: string;
    value2: string;
  };
  test: {
    divisbleBy: number;
    ifYes: number;
    ifNo: number;
  };
  activity: number;
}

const inputParser = new InputParser("in.txt");

const monkeys: Monkey[] = [];

while (inputParser.hasNext()) {
  const monkeyString = inputParser.nextUntilEmptyLine()!;
  const startingItems = monkeyString[1].match(/\d+/g)!.map(Number);
  const operation = monkeyString[2]
    .match(/(\d+|old)\ .\ (\d+|old)/)![0]
    .split(" ");

  const test = monkeyString[3].match(/\d+/g)!;
  const ifYes = monkeyString[4].match(/\d+/g)!;
  const ifNo = monkeyString[5].match(/\d+/g)!;

  monkeys.push({
    items: startingItems,
    operation: {
      operation: operation[1],
      value1: operation[0],
      value2: operation[2],
    },
    test: {
      divisbleBy: Number(test[0]),
      ifYes: Number(ifYes[0]),
      ifNo: Number(ifNo[0]),
    },
    activity: 0,
  });
}

const superModulo = monkeys.reduce(
  (prev, monkey) => monkey.test.divisbleBy * prev,
  1
);

for (let i = 0; i < 10000; i++) {
  for (const monkey of monkeys) {
    while (monkey.items.length) {
      const item = monkey.items.shift()!;

      let newValue = 0;
      let value1 =
        monkey.operation.value1 === "old"
          ? item
          : Number(monkey.operation.value1);
      let value2 =
        monkey.operation.value2 === "old"
          ? item
          : Number(monkey.operation.value2);

      switch (monkey.operation.operation) {
        case "+":
          newValue = value1 + value2;
          break;
        case "*":
          newValue = value1 * value2;
      }
      newValue = newValue % superModulo;

      if (newValue % monkey.test.divisbleBy == 0)
        monkeys[monkey.test.ifYes].items.push(newValue);
      else monkeys[monkey.test.ifNo].items.push(newValue);

      monkey.activity++;
    }
  }
}

monkeys.sort((a, b) => b.activity - a.activity);
console.log("Business level: ", monkeys[0].activity * monkeys[1].activity);
