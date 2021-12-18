let values = [];
let string = [];
let currentlyAdding = false;
let added = 0;
let done = false;
let auto = false;

const load = () => {
  const input = document.getElementById("input");
  values = input.value
    ? input.value.split("\n").map((s) => s.split(""))
    : ["[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]"].map((s) => s.split(""));

  document.querySelectorAll(".addition-stack-item").forEach((item) => item.remove());

  for (let i = 0; i < values.length; i++) {
    document
      .getElementById("addition-stack")
      .insertAdjacentHTML("beforeend", `<div class="addition-stack-item" id="add-${i}">${values[i].join("")}</div>`);
  }

  currentlyAdding = false;
  added = 0;
  done = false;
  if (auto) switchAuto();
  string = [];

  document.getElementById("container").classList.add("shown");
};

let interval = null;

const switchAuto = () => {
  if (auto) {
    auto = false;
    document.getElementById("auto").innerHTML = " ";
    clearInterval(interval);
  } else {
    auto = true;
    document.getElementById("auto").innerHTML = "*";
    interval = setInterval(() => {
      next();
    }, 20);
  }
};

const setNote = (note) => {
  if (auto) return (document.getElementById("note").innerHTML = "");
  document.getElementById("note").innerHTML = note;
};

const updateCurrent = (value) => {
  document.getElementById(`current`).innerHTML = value
    .map((char, i) => `<span id="char-${i}" class="${["[", "]", ","].includes(char) ? "bracket" : ""}">${char}</span>`)
    .join("");
};

const countNesting = (input) => {
  let nesting = 0;
  let maxNesting = 0;

  for (const char of input) {
    if (char === "[") {
      nesting++;
      if (maxNesting < nesting) {
        maxNesting = nesting;
      }
    } else if (char === "]") {
      nesting--;
    }
  }

  return maxNesting;
};

const getIndexesOfNestng = (input) => {
  let startPos = 0;
  let endPos = 0;
  let nesting = 0;

  for (const char of input) {
    startPos++;
    if (char === "[") {
      nesting++;
    } else if (char === "]") {
      nesting--;
    }

    if (nesting === 5) {
      break;
    }
  }

  endPos = startPos + 4;

  return [startPos - 1, endPos - 1];
};

const maxNumber = (input) => {
  let max = 0;
  let index = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (["[", "]", ","].includes(char)) continue;
    if (parseInt(char) > 9) {
      return [parseInt(char), i];
    }
  }
  return [max, index];
};

const mark = (from, to, className) => {
  for (let i = from; i <= to; i++) {
    document.getElementById(`char-${i}`).classList.add(className);
  }
};

let inAction = false;
const next = () => {
  if (string.length === 0) {
    string = values[0];
    document.getElementById(`add-${added}`).remove();

    updateCurrent(string);
    setNote("Load first element from addition stack");
    added++;
    return;
  }

  if (!currentlyAdding) {
    currentlyAdding = true;
    if (added >= values.length) {
      setNote("All elements added");
      done = true;
      return;
    }
    string = ["[", ...string, ",", ...values[added], "]"];
    updateCurrent(string);
    setNote("Add together current and next element from addition stack");
    document.getElementById(`add-${added}`).remove();
    added++;
    return;
  }

  if (countNesting(string) >= 5 && !inAction) {
    if (auto) {
      inAction = true;
      return;
    }
    const [start, end] = getIndexesOfNestng(string);
    mark(start, end, "explode");
    setNote("Nesting is too deep. Explode this pair.");

    inAction = true;
    return;
  }

  if (countNesting(string) >= 5 && inAction) {
    inAction = false;
    const [start, end] = getIndexesOfNestng(string);
    const [a, b] = string
      .slice(start, end + 1)
      .filter((c) => !["[", "]", ","].includes(c))
      .map(Number);

    for (let i = end + 1; i < string.length; i++) {
      if (["[", "]", ","].includes(string[i])) continue;

      string[i] = (b + parseInt(string[i])).toString();
      break;
    }

    for (let i = start; i >= 0; i--) {
      if (["[", "]", ","].includes(string[i])) continue;

      string[i] = (a + parseInt(string[i])).toString();
      break;
    }

    string.splice(start, end - start + 1, "0");

    updateCurrent(string);
    setNote("Exploded");

    return;
  }

  if (maxNumber(string)[0] > 9 && !inAction) {
    if (auto) {
      inAction = true;
      return;
    }
    const [max, index] = maxNumber(string);
    mark(index, index, "big");
    setNote("Number is too big. Split it.");

    inAction = true;
    return;
  }

  if (maxNumber(string)[0] > 9 && inAction) {
    const [number, index] = maxNumber(string);
    string.splice(index, 1, ...["[", Math.floor(number / 2).toString(), ",", Math.ceil(number / 2).toString(), "]"]);
    updateCurrent(string);
    setNote("Number splitted to " + Math.floor(number / 2).toString() + " and " + Math.ceil(number / 2).toString());
    inAction = false;
    return;
  }

  if (done) {
    if (auto) switchAuto();
    setNote("Calculated magnitude is: " + getMagintude(string));
    return;
  }

  setNote("We cannot do anything more, so we will continue.");
  currentlyAdding = false;
};

const getMagintude = (input) => {
  if (input.length === 1) return parseInt(input[0]);

  let nested = 0;
  let first = [];
  let second = [];
  let magnitude = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === "[") {
      nested++;
    } else if (input[i] === "]") {
      nested--;
    }
    if (input[i] === "," && nested === 1) {
      first = input.slice(1, i);
      second = input.slice(i + 1, input.length - 1);
      break;
    }

    if (nested === 0) return i;
  }

  magnitude += getMagintude(first) * 3;
  magnitude += getMagintude(second) * 2;

  return magnitude;
};
