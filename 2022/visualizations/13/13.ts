let defaultValue = "";
const textarea = document.querySelector("textarea");

(async () => {
  const req = await fetch("./default.txt");
  defaultValue = await req.text();
  textarea!.placeholder = defaultValue;
})();

type Box<T> = { value: T };

const sortAsync = async <T>(
  arr: T[],
  cmp: (a: T, b: T) => Promise<number>
): Promise<T[]> => {
  // Keep a list of two values and the precedence
  const results: [Box<T>, Box<T>, number][] = [];

  // Box the value in case you're sorting primitive values and some
  // values occur more than once.
  const result: Box<T>[] = arr.map((value) => ({ value }));

  for (;;) {
    let nextA: Box<T>,
      nextB: Box<T>,
      requiresSample = false;

    result.sort((a, b) => {
      // Check if we have to get the precedence of a value anyways,
      // so we can skip this one.
      if (requiresSample) return 0;

      // See if we already now which item should take precedence
      const match = results.find((v) => v[0] === a && v[1] === b);
      if (match) return match[2];

      // We need the precedence of these two elements
      nextA = a;
      nextB = b;
      requiresSample = true;
      return 0;
    });

    if (requiresSample) {
      // Let the async function calculate the next value
      results.push([nextA, nextB, await cmp(nextA.value, nextB.value)]);
    } else break; // It's fully sorted
  }

  // Map the sorted boxed-value array to its containing value back again
  return result.map((v) => v.value);
};

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let speed = 200;

const slots = document.querySelector("#packet-slots") as HTMLDivElement;
const packetsEl = document.querySelector("#packets") as HTMLDivElement;

const run = async () => {
  const text = textarea!.value || defaultValue;
  console.log(text);
  const packets = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  console.log(packets);

  let numberCount = 0;
  let symbolCount = 0;

  for (const index in packets) {
    const packet = packets[+index];
    const slot = document.createElement("div");
    slot.classList.add("packet-slot");
    slots.appendChild(slot);

    const packetDiv = document.createElement("div");
    packetDiv.classList.add("packet");
    packetDiv.id = `packet-${index}`;

    let i;
    for (i = 0; i < packet.length; i++) {
      const charDiv = document.createElement("div");
      charDiv.classList.add("char");

      let currentChar;

      while (!isNaN(parseInt(packet[i]))) {
        if (currentChar) currentChar += packet[i];
        else currentChar = packet[i];

        if (!isNaN(parseInt(packet[i + 1]))) i++;
        else break;
      }

      if (currentChar !== undefined) {
        charDiv.classList.add("number");
        charDiv.id = `packet-${index}-number-${numberCount}`;

        numberCount++;
      } else {
        currentChar = packet[i];

        if (currentChar === "[") {
          charDiv.id = `packet-${index}-symbol-${symbolCount}`;
          symbolCount++;
        } else if (currentChar === "]") {
          symbolCount--;
          charDiv.id = `packet-${index}-symbol-${symbolCount}`;
        }

        charDiv.classList.add("symbol");
      }

      charDiv.textContent = currentChar;
      packetDiv.appendChild(charDiv);
    }

    packetsEl.appendChild(packetDiv);
  }

  type ArrayType = (ArrayType | number)[];

  const compareObjects = async (
    a: ArrayType,
    b: ArrayType
  ): Promise<number> => {
    const minLen = Math.min(a.length, b.length);
    for (let i = 0; i < minLen; i++) {
      if (typeof a[i] == "number" && typeof b[i] == "number") {
        if (a[i] < b[i]) return 1;
        if (a[i] > b[i]) return 0;
      }
      let r;
      if (typeof a[i] == "object" && typeof b[i] == "object") {
        r = await compareObjects(a[i] as ArrayType, b[i] as ArrayType);
      }

      if (typeof a[i] == "number" && typeof b[i] == "object") {
        r = await compareObjects([a[i]], b[i] as ArrayType);
      }

      if (typeof a[i] == "object" && typeof b[i] == "number") {
        r = await compareObjects(a[i] as ArrayType, [b[i]]);
      }

      if (r == 1) return 1;
      if (r == 0) return 0;
    }

    if (a.length < b.length) return 1;
    else if (a.length > b.length) return 0;
    else return 2;
  };

  const parsedPackets = packets.map((packet) =>
    JSON.parse(packet)
  ) as ArrayType[];

  const sorted = await sortAsync(parsedPackets, compareObjects);
  console.log(sorted);
};

export {};
