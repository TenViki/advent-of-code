import { InputParser } from "../lib/files";

let sum = 0;

const parser = new InputParser("input.txt");
while (parser.hasNext()) {
  const string = parser.next()!;
  const [gameId, gameStatus] = string.split(": ");
  const [, gameIdNumber] = gameId.split(" ");

  const maxPossible: { [s: string]: number } = {
    red: 0,
    green: 0,
    blue: 0,
  };

  const games = gameStatus.split("; ");

  let possible = true;

  for (const game of games) {
    const rounds = game.split(", ");
    for (const round of rounds) {
      const [number, color] = round.split(" ");

      if (maxPossible[color] < +number) maxPossible[color] = +number;
    }
  }

  const gamePower = maxPossible.red * maxPossible.green * maxPossible.blue;

  sum += gamePower;
}

console.log(sum);
