import { InputParser } from "../files";

const input = new InputParser("in.txt");

const lanterFish = input.getFullInput().split(",").map(Number);
console.log(lanterFish);

let simulationLength = 80;

const runSimulation = () => {
  let add = 0;
  for (let i = 0; i < lanterFish.length; i++) {
    const current = lanterFish[i];
    if (current === 0) {
      add++;
      lanterFish[i] = 6;
    } else {
      lanterFish[i] = current - 1;
    }
  }

  for (let i = 0; i < add; i++) {
    lanterFish.push(8);
  }
};

for (let i = 0; i < simulationLength; i++) {
  runSimulation();
}

console.log(lanterFish.length);
