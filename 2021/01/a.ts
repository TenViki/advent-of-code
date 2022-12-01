import { InputParser } from "../files";

const input = new InputParser("in.txt");
let prev = null;
let bigger = 0;
while (input.hasNext()) {
  let num = +input.next()!;
  if (prev !== null && num > prev) {
    bigger++;
  }
  prev = num;
}

console.log(bigger);
