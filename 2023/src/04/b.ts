import { InputParser } from "../lib/files";
const parser = new InputParser("input.txt");

const scoreMap = new Map<number, number>();

let i = 0;

while (parser.hasNext()) {
  const line = parser.next()!;
  i++;

  let score = 0;

  const [, winningStr, inclStr] = line.split(/:|\|/);
  const winning = winningStr
    .split(" ")
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));
  const incl = inclStr
    .split(" ")
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));

  for (let number of winning) if (incl.includes(number)) score++;

  scoreMap.set(i, score);
}

console.log(scoreMap);

let totalCards = 0;

const getNumberOfCards = (cardId: number, k = 0): number => {
  let allNextCards = scoreMap.get(cardId);

  if (!allNextCards) return 0;
  totalCards += allNextCards;

  for (let i = cardId + 1; i <= cardId + allNextCards; i++) {
    getNumberOfCards(i, k + 1);
  }

  return 0;
};

for (let k of scoreMap.keys()) {
  totalCards++;
  getNumberOfCards(k);
}

console.log(totalCards);
