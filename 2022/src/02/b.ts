import { InputParser } from "../lib/files";

const parser = new InputParser("in.txt");

type Move = "A" | "B" | "C";

const gameRules: {
  [k in Move]: {
    value: number;
    beats: Move;
    losesTo: Move;
  };
} = {
  A: {
    value: 1,
    beats: "C",
    losesTo: "B",
  },
  B: {
    value: 2,
    beats: "A",
    losesTo: "C",
  },
  C: {
    value: 3,
    beats: "B",
    losesTo: "A",
  },
};

console.log(gameRules);

let score = 0;

while (parser.hasNext()) {
  const [opponent, neededOutcome] = parser.next()!.trim().split(" ");

  const move = gameRules[opponent as Move];

  switch (neededOutcome) {
    case "X": // player should lose
      score += gameRules[move.beats].value;
      break;

    case "Y": // should end with draw
      score += move.value + 3;
      break;

    case "Z": // should win
      score += gameRules[move.losesTo].value + 6;
      break;
  }
}

console.log(score);
