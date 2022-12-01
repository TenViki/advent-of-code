import { InputParser } from "../files";

const input = new InputParser("in.txt");
let horizontalPosition = 0;
let verticalPosition = 0;
let aim = 0;

while (input.hasNext()) {
  const line = input.next()!;

  const [dir, am] = line.split(" ");
  const amount = +am;

  if (dir === "forward") {
    horizontalPosition += amount;
    verticalPosition += aim * amount;
  }

  if (dir === "down") {
    aim += amount;
  }

  if (dir === "up") {
    aim -= amount;
  }
}

console.log(horizontalPosition * verticalPosition);
