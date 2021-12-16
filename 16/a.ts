// Packet:
// 3 bits: Protocol version
// 3 bits: Type id
// - 4 Literal value
// Groups of 5:
// - Starts with 0: Last group
// - 4 bits: Value

import { InputParser } from "../files";

const input = new InputParser("test.txt");

const data = input.getFullInput();

const hexDict: { [s: string]: string } = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

const hexToBin = (hex: string) => {
  let bin = "";
  for (const letter of hex) {
    bin += hexDict[letter];
  }
  return bin;
};

const bin = hexToBin(data);

const parseLiteralPocket = (pocket: string, level: number) => {
  const data = pocket.slice(6);
  let end = false;
  let current = 0;
  let value = "";

  while (!end) {
    const group = data.slice(current, current + 5);
    current += 5;
    value += group.slice(1, 5);
    if (group[0] === "0") end = true;
  }

  console.log("Literal packet found!");
  console.log("Level:", level);
  console.log("Value:", parseInt(value, 2));
  console.log();

  return current;
};

let sum = 0;

const parsePocket = (pocket: string, level: number) => {
  const version = pocket.slice(0, 3);
  const type = pocket.slice(3, 6);

  sum += parseInt(version, 2);

  if (parseInt(type, 2) === 4) {
    const length = parseLiteralPocket(pocket, level);
    return length + 6;
  } else {
    const lengthType = pocket.slice(6, 7);

    // Number represents number of sub-pockets in this operator pocket
    if (lengthType === "1") {
      let lengthFactor = parseInt(pocket.slice(7, 7 + 11), 2);
      let length = 0;
      for (let i = 0; i < lengthFactor; i++) {
        length += parsePocket(pocket.slice(7 + 11 + length), level + 1)!;
      }
      return 7 + 11 + length;
    }

    // Number represents length of data in which subpockets are
    if (lengthType === "0") {
      let lengthFactor = parseInt(pocket.slice(7, 7 + 15), 2);
      let lengthCounter = 0;
      while (lengthCounter < lengthFactor) {
        const packetLength = parsePocket(pocket.slice(7 + 15 + lengthCounter), level + 1)!;
        lengthCounter += packetLength;
      }

      return 7 + 15 + lengthFactor;
    }
  }
};

console.log(bin);

parsePocket(bin, 0);
console.log(sum);
