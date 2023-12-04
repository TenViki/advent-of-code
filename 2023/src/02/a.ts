import { InputParser } from "../lib/files";

let sum = 0;

const maxConfigurations: { [s: string]: number } = {
  red: 12,
  green: 13,
  blue: 14,
};

const parser = new InputParser("input.txt");
while (parser.hasNext()) {
  const string = parser.next()!;
  const [gameId, gameStatus] = string.split(": ");
  const [, gameIdNumber] = gameId.split(" ");

  const games = gameStatus.split("; ");

  let possible = true;

  for (const game of games) {
    const rounds = game.split(", ");
    for (const round of rounds) {
      const [number, color] = round.split(" ");
      if (+number > maxConfigurations[color]) possible = false;
    }
  }

  if (possible) sum += +gameIdNumber;
}

console.log(sum);
