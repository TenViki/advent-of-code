import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const cardData: {
  hand: string;
  handRank: number;
  bid: number;
}[] = [];

const cards = "J23456789TQKA";

const getHandRank = (hand: string) => {
  const cardNumbering: { [card: string]: number } = {};

  for (const card of hand) {
    if (cardNumbering[card]) cardNumbering[card]++;
    else cardNumbering[card] = 1;
  }

  const jNumber = cardNumbering["J"];

  delete cardNumbering["J"];

  const values = Object.values(cardNumbering);

  if (!jNumber) {
    if (values.includes(5)) return 7;
    if (values.includes(4)) return 6;
    if (values.includes(3) && values.includes(2)) return 5;
    if (values.includes(3)) return 4;
    if (values.filter((s) => s == 2).length == 2) return 3;
    if (values.filter((s) => s == 1).length == 3) return 2;
    if (values.filter((s) => s == 1).length == 5) return 1;
  }
  if (jNumber === 5) return 7;
  if (jNumber === 4) return 7;
  if (jNumber === 3) {
    // there are 3 J cards in hand
    // in case JJJ34 - four of kind best
    if (values.includes(2)) return 7;
    else return 6;
  }
  if (jNumber === 2) {
    // if three other same cards - five of kind
    if (values.includes(3)) return 7;
    // if two other same cards - four of kind
    if (values.includes(2)) return 6;
    //if all cards different, return 4,
    // because if we could do full house, four of kind is better
    return 4;
  }
  if (jNumber === 1) {
    // five of kind
    if (values.includes(4)) return 7;
    // four of kind
    if (values.includes(3)) return 6;

    // full house
    // JAABB, AJBBB,
    if (values.includes(3) && values.includes(1)) return 5;
    if (values.filter((s) => s == 2).length == 2) return 5;

    // three of kind
    if (values.includes(2)) return 4;

    //two pair - not possible -> would fall back to three of kind

    return 2; // one pair has higher value than high card
  }

  return 0;
};

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
