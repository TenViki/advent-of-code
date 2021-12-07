import { InputParser } from "../files";

const input = new InputParser("in.txt");
let horizontalPosition = 0;
let verticalPosition = 0;

while (input.hasNext()) {
  const line = input.next()!;

  const [dir, am] = line.split(" ");
  const amount = +am;

  if (dir === "forward") {
    horizontalPosition += amount;
  }

  if (dir === "down") {
    verticalPosition += amount;
  }

  if (dir === "up") {
    verticalPosition -= amount;
  }
}

console.log(horizontalPosition, verticalPosition);
