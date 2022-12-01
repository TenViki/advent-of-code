import { InputParser } from "../files";

const input = new InputParser("08/in.txt");
let numbers = 0;

const data = input.getFullInput().split("\n");
data.forEach((d) => {
  const [_, digits] = d.split(" | ");
  digits.split(" ").forEach((str) => {
    switch (str.length) {
      case 2:
      case 4:
      case 3:
      case 7:
        numbers++;
        break;

      default:
        break;
    }
  });
});
console.log(numbers);
