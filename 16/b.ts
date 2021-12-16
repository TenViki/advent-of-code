// Packet:
// 3 bits: Protocol version
// 3 bits: Type id
// - 4 Literal value
// Groups of 5:
// - Starts with 0: Last group
// - 4 bits: Value

import { InputParser } from "../files";

const input = new InputParser("in.txt");

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

const parseLiteralPacket = (packet: string): [number, number] => {
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

  console.log("Found literal packet:", parseInt(value, 2));

  return [current, parseInt(value, 2)];
};

let sum = 0;

const parsePacket = (packet: string): [number, number] => {
  const version = packet.slice(0, 3);
  const type = packet.slice(3, 6);

  sum += parseInt(version, 2);

  if (parseInt(type, 2) === 4) {
    const [length, number] = parseLiteralPacket(packet);
    return [length + 6, number];
  } else {
    const lengthType = packet.slice(6, 7);
    const numbers = [];
    let length = 0;

    // Number represents number of sub-packets in this operator packet
    if (lengthType === "1") {
      let lengthFactor = parseInt(packet.slice(7, 7 + 11), 2);
      let len = 0;
      for (let i = 0; i < lengthFactor; i++) {
        const [l, value] = parsePacket(packet.slice(7 + 11 + len))!;
        len += l;
        numbers.push(value);
      }

      length = 7 + 11 + len;
    }

    // Number represents length of data in which subpackets are
    if (lengthType === "0") {
      let lengthFactor = parseInt(packet.slice(7, 7 + 15), 2);
      let lengthCounter = 0;
      while (lengthCounter < lengthFactor) {
        const [packetLength, value] = parsePacket(packet.slice(7 + 15 + lengthCounter))!;
        lengthCounter += packetLength;
        numbers.push(value);
      }

      length = 7 + 15 + lengthFactor;
    }

    let result = 0;

    switch (parseInt(type, 2)) {
      case 0:
        result = numbers.reduce((a, b) => a + b);
        break;

      case 1:
        result = numbers.reduce((a, b) => a * b);
        break;

      case 2:
        result = Math.min(...numbers);
        break;

      case 3:
        result = Math.max(...numbers);
        break;

      case 5:
        result = numbers[0] > numbers[1] ? 1 : 0;
        break;

      case 6:
        result = numbers[0] < numbers[1] ? 1 : 0;
        break;

      case 7:
        result = numbers[0] === numbers[1] ? 1 : 0;
        break;
    }

    return [length, result];
  }
};

const d = parsePacket(bin);
console.log(d);
