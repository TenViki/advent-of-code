import { InputParser } from "../files";

const input = new InputParser("in.txt");
const data = input
  .getFullInput()
  .replaceAll("\r", "")
  .split("\n")
  .map((x) => x.substring(x.length - 1))
  .map(Number);

interface Player {
  position: number;
  score: number;
}

const players: Player[] = data.map((x) => ({ position: x, score: 0 }));

let dice = 1;

const incrementPositionByScore = (player: Player, moveBy: number) => {
  let newPosition = (player.position + moveBy) % 10;
  if (newPosition === 0) newPosition = 10;

  player.position = newPosition;
  player.score += newPosition;
};

let end = false;
let rolls = 0;
let result = 0;

while (!end) {
  players.forEach((player, i) => {
    if (end) return;
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      if (dice === 101) dice = 1;
      sum += dice;
      rolls++;
      console.log(dice);
      dice++;
    }

    incrementPositionByScore(player, sum);
    console.log("Player", i, "moved by", sum, "to", player.position, "score:", player.score);

    if (player.score >= 1000) {
      end = true;
      result = players[1 - i].score;
    }
  });
}

console.log(result * rolls, result, rolls);
