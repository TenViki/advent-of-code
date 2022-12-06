const defaultValue = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;
const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const textarea = document.querySelector("textarea");
textarea!.placeholder = defaultValue;

let partA = new Array(4).fill("");
let partB = new Array(14).fill("");

const row = document.getElementById("row");

const checkForDuplicates = (arr: string[]) => {
  const s: string[] = [];

  for (const c of arr) {
    if (s.includes(c) || c == "") continue;
    else s.push(c);
  }

  return s.length == arr.length;
};

const counter = document.getElementById("counter");
const partAElement = document.getElementById("part1-win");
const partBElement = document.getElementById("part2-win");
const partAScore = document.getElementById("part1-score");
const partBScore = document.getElementById("part2-score");

let partADone = false;
let partBDone = false;

const run = async () => {
  partADone = false;
  partBDone = false;
  partA = new Array(4).fill("");
  partB = new Array(14).fill("");
  row!.innerHTML = "";

  const workingValue = textarea!.value || defaultValue;

  for (const char in workingValue.split("")) {
    const spanElement = document.createElement("span");
    spanElement.classList.add("char");
    spanElement.textContent = workingValue[char];
    spanElement.id = `char-${char}`;
    row?.insertAdjacentElement("beforeend", spanElement);
  }

  for (const char in workingValue.split("")) {
    const charElement = document.getElementById(`char-${char}`);

    const actBefore = document.querySelector(".active");
    if (actBefore) {
      actBefore.classList.remove("active");
      actBefore.classList.add("removing");
    }

    charElement!.classList.add("active");

    await wait(150);
    counter!.textContent = char;
    actBefore?.remove();

    if (!partADone) {
      partA.shift();
      partA.push(workingValue[char]);

      partAElement!.textContent = partA.join("");
      partAScore!.textContent = (+char + 1).toString();

      if (checkForDuplicates(partA)) {
        partADone = true;
      }
    }

    if (!partBDone) {
      partB.shift();
      partB.push(workingValue[char]);

      partBElement!.textContent = partB.join("");
      partBScore!.textContent = (+char + 1).toString();

      if (checkForDuplicates(partB)) {
        partBDone = true;
      }
    }
  }
};

export {};
