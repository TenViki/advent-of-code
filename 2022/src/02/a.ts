import { InputParser } from "../lib/files";

const parser = new InputParser("in.txt");

// X beats C
// Y beats A
// Z beats B

type PlayerMove = "X" | "Y" | "Z";

const gameRules = {
  X: {
    beats: "C",
    draw: "A",
    score: 1,
  },
  Y: {
    beats: "A",
    draw: "B",
    score: 2,
  },
  Z: {
    beats: "B",
    draw: "C",
    score: 3,
  },
};

let score = 0;

while (parser.hasNext()) {
  const [opponent, player] = parser.next()!.trim().split(" ");
  const movePlayed = gameRules[player as PlayerMove];

  score += movePlayed.score;
  if (movePlayed.beats === opponent) score += 6;
  if (movePlayed.draw === opponent) score += 3;
}

console.log(score);
