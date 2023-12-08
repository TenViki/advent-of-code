import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const cardData: {
  hand: string;
  handRank: number;
  bid: number;
}[] = [];

const getHandRank = (hand: string) => {
  const cardNumbering: { [card: string]: number } = {};

  for (const card of hand) {
    if (cardNumbering[card]) cardNumbering[card]++;
    else cardNumbering[card] = 1;
  }

  const values = Object.values(cardNumbering);

  if (values.includes(5)) return 7;
  if (values.includes(4)) return 6;
  if (values.includes(3) && values.includes(2)) return 5;
  if (values.includes(3)) return 4;
  if (values.filter((s) => s == 2).length == 2) return 3;
  if (values.filter((s) => s == 1).length == 3) return 2;
  if (values.filter((s) => s == 1).length == 5) return 1;
  return 0;
};

const cards = " 23456789TJQKA";
const getCardValue = (card: string) => {
  return cards.indexOf(card);
};

while (parser.hasNext()) {
  const [hand, bidStr] = parser.next()!.split(" ");

  const cardRank = getHandRank(hand);

  cardData.push({
    handRank: cardRank,
    bid: +bidStr,
    hand: hand,
  });
}

cardData.sort((a, b) => {
  if (a.handRank !== b.handRank) return a.handRank - b.handRank;

  let cardIndex = 0;

  while (a.hand[cardIndex] == b.hand[cardIndex]) {
    cardIndex++;
  }

  return getCardValue(a.hand[cardIndex]) - getCardValue(b.hand[cardIndex]);
});

console.log(cardData);

let sum = 0;
let i = 1;

for (const record of cardData) {
  sum += i * record.bid;
  i++;
}

console.log("Answer:", sum);
