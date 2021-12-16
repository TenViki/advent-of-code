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

const parseLiteralPacket = (packet: string, level: number) => {
  const data = packet.slice(6);
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

const parsePacket = (packet: string, level: number) => {
  const version = packet.slice(0, 3);
  const type = packet.slice(3, 6);

  sum += parseInt(version, 2);

  if (parseInt(type, 2) === 4) {
    const length = parseLiteralPacket(packet, level);
    return length + 6;
  } else {
    const lengthType = packet.slice(6, 7);

    // Number represents number of sub-packets in this operator packet
    if (lengthType === "1") {
      let lengthFactor = parseInt(packet.slice(7, 7 + 11), 2);
      let length = 0;
      for (let i = 0; i < lengthFactor; i++) {
        length += parsePacket(packet.slice(7 + 11 + length), level + 1)!;
      }
      return 7 + 11 + length;
    }

    // Number represents length of data in which subpackets are
    if (lengthType === "0") {
      let lengthFactor = parseInt(packet.slice(7, 7 + 15), 2);
      let lengthCounter = 0;
      while (lengthCounter < lengthFactor) {
        const packetLength = parsePacket(packet.slice(7 + 15 + lengthCounter), level + 1)!;
        lengthCounter += packetLength;
      }

      return 7 + 15 + lengthFactor;
    }
  }
};

console.log(bin);

parsePacket(bin, 0);
console.log(sum);
