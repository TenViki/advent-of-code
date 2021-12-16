const hexDict = {
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

const hexToBin = (hex) => {
  let bin = "";
  for (const letter of hex) {
    bin += hexDict[letter.toUpperCase()];
  }
  return bin;
};

let bin = "";

const load = async () => {
  const res = await fetch("data.txt");
  const data = document.getElementById("hex").value;

  if (!data) return alert("Please enter a hex string");

  bin = hexToBin(data);
  if (bin.includes("undefined")) return alert("Please enter a valid hex string");
  document.getElementById("transmitted-data").innerHTML = bin
    .split("")
    .map((bit, i) => `<span id="bit-${i}">${bit}</span>`)
    .join("");

  return 1;
};

const parseLiteralPacket = (packet, start) => {
  const data = packet.slice(6);
  let end = false;
  let current = 0;
  let value = "";

  while (!end) {
    const group = data.slice(current, current + 5);
    current += 5;
    classSection(start + 6 + current - 5, 1, "endbit");
    value += group.slice(1, 5);
    if (group[0] === "0") end = true;
  }

  return [current, parseInt(value, 2)];
};

const parseOperatorPacket = async (packet, type, start, level) => {
  const lengthType = packet.slice(6, 7);
  const numbers = [];
  let length = 0;

  classSection(start + 6, 1, "lengthtype");

  // Number represents number of sub-packets in this operator packet
  if (lengthType === "1") {
    let lengthFactor = parseInt(packet.slice(7, 7 + 11), 2);
    classSection(start + 7, 11, "lengthfactor");
    let len = 0;
    for (let i = 0; i < lengthFactor; i++) {
      const [l, value] = await parsePacket(packet.slice(7 + 11 + len), start + 7 + 11 + len, level + 1);
      len += l;
      numbers.push(value);
    }

    length = 11 + len;
  }

  // Number represents length of data in which subpackets are
  if (lengthType === "0") {
    let lengthFactor = parseInt(packet.slice(7, 7 + 15), 2);
    let lengthCounter = 0;
    classSection(start + 7, 15, "lengthfactor");
    while (lengthCounter < lengthFactor) {
      const [packetLength, value] = await parsePacket(packet.slice(7 + 15 + lengthCounter), start + 7 + 15 + lengthCounter, level + 1);
      lengthCounter += packetLength;
      numbers.push(value);
    }

    length = 15 + lengthFactor;
  }

  let result = 0;

  switch (type) {
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
      console.log(result);
      result = numbers[0] === numbers[1] ? 1 : 0;
      break;
  }

  return [length, result];
};

let wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createRowAt = (level) => {
  for (i = 0; i < level + 1; i++) {
    if (document.getElementById(`l-${i}`)) continue;
    let html = `<div id="l-${i}">`;
    bin.split("").forEach((bit, index) => {
      let toInsert = " ";
      const above = document.getElementById(`${i - 1}-${index}`)?.textContent;
      if (above === "┘") toInsert = "│";
      if (above === "└") toInsert = "│";
      if (above === "│") toInsert = "│";
      html += `<span id="${level}-${index}">${toInsert}</span>`;
    });
    html += "</div>";
    document.getElementById("markers").insertAdjacentHTML("afterbegin", html);
  }
};

const mark = (start, length, level, label) => {
  let iterator = 0;
  for (let i = start; i < start + length; i++) {
    const element = document.getElementById(`${level}-${i}`);

    let toInsert = "─";

    if (iterator > 0 && iterator - 1 < label.length) {
      toInsert = label[iterator - 1];
      element.classList.add("label");
    }

    if (i === start) toInsert = "└";
    if (i === start + length - 1) toInsert = "┘";
    element.textContent = toInsert;
    iterator++;
  }

  let i = level + 1;
  while (document.getElementById(`l-${i}`)) {
    document.getElementById(`${i}-${start}`).textContent = "│";

    let toInsert = "│";
    if (
      document.getElementById(`${i}-${start + length - 1}`).textContent === "┘" ||
      document.getElementById(`${i}-${start + length - 1}`).textContent === "┤"
    )
      toInsert = "┤";
    document.getElementById(`${i}-${start + length - 1}`).textContent = toInsert;
    i++;
  }
};

const table = {
  0: "+",
  1: "*",
  2: "min",
  3: "max",
  4: "ltr",
  5: ">",
  6: "<",
  7: "==",
};

const classSection = (start, length, string) => {
  for (let i = start; i < start + length; i++) {
    document.getElementById(`bit-${i}`).classList.add(string);
  }
};

const parsePacket = async (packet, start, level) => {
  const version = parseInt(packet.slice(0, 3), 2);
  console.log(version, start);
  classSection(start, 3, "version");
  const type = parseInt(packet.slice(3, 6), 2);
  classSection(start + 3, 3, "type");
  createRowAt(level);

  let fullLength = 0;
  let result = 0;

  if (type === 4) {
    const [length, number] = parseLiteralPacket(packet, start);
    classSection(start + 6, length, "value");
    fullLength = length + 6;
    result = number;
  } else {
    const [length, number] = await parseOperatorPacket(packet, type, start, level);
    fullLength = length + 7;
    result = number;
  }

  mark(start, fullLength, level, `${table[type]}, ${result}`);
  await wait(0);

  return [fullLength, result];
};

const main = async () => {
  if (!(await load())) return;

  try {
    await parsePacket(bin, 0, 0);
  } catch {
    alert("Invalid packet. You probably entered invalid input.");
  }
};
