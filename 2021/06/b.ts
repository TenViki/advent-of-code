import { InputParser } from "../files";

const input = new InputParser("in.txt");

const lanterFish = input.getFullInput().split(",").map(Number);
console.log(lanterFish);

let simulationLength = 256;

const runSimulation = () => {
  var initial = lanterFish.slice();
  var count: { [n: number]: number } = {};
  for (var fish of initial) {
    if (count[fish] === undefined) count[fish] = 0;
    count[fish] += 1;
  }
  for (var day = 0; day < simulationLength; day++) {
    var new_count: { [n: number]: number } = {};
    for (const k in count) {
      const v = count[k];
      if (+k > 0) {
        if (new_count[+k - 1] === undefined) new_count[+k - 1] = 0;
        new_count[+k - 1] += v;
      } else {
        if (new_count[6] === undefined) new_count[6] = 0;
        if (new_count[8] === undefined) new_count[8] = 0;
        new_count[6] += v;
        new_count[8] += v;
      }
    }
    count = new_count;
  }
  return Object.values(count).reduce(function (a, b) {
    return a + b;
  });
};

console.log(runSimulation());
