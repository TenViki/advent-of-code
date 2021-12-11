const run = async () => {
  const fetched = await fetch("./data.txt");
  const data = await (await fetched.text()).split("\r\n");

  const html = data.map((l, i) => {
    let line = `<div id="${i}">`;
    l.split("").forEach((char, j) => {
      line += `<span id="${i}-${j}" class="character">${char}</span>`;
    });
    return line;
  });

  document.getElementById("current").innerHTML = html.join("");
  document.getElementById("run").remove();

  main(data.map((l) => l.split("").map(Number)));
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const allZeroes = (data) => {
  for (let i in data) {
    for (let j in data[i]) {
      if (data[i][j] !== 0) return false;
    }
  }
  return true;
};

const clearColors = () => {
  document.querySelectorAll(".character").forEach((e) => {
    e.style.color = "";
  });
};

const visitedInRound = new Set();

const checkForFlashes = async (data) => {
  while (countNines(data)) {
    for (let i in data) {
      for (let j in data[i]) {
        const number = data[i][j];
        if (number === 9) {
          if (visitedInRound.has(`${i}-${j}`)) continue;
          const toCheck = [...directions.map((x) => [x[0] + +i, x[1] + +j])];
          visitedInRound.add(`${i}-${j}`);
          updateGrid(data);
          data[i][j] = -1;

          document.getElementById(`${i}-${j}`).style.color = "#f1c40f";
          await wait(10);

          flashes++;
          document.getElementById("flashes").textContent = flashes;
          for (let i in toCheck) {
            const [x, y] = toCheck[i];
            if (!data[x] || data[x][y] === undefined) continue;

            if (visitedInRound.has(`${x}-${y}`)) continue;

            if (data[x][y] === 9) continue;
            if (data[x][y] === -1) continue;

            data[x][y]++;
          }
        }
      }
    }
  }
  clearColors();

  visitedInRound.clear();
};

const countNines = (data) => {
  let count = 0;
  for (let i in data) {
    for (let j in data[i]) {
      if (visitedInRound.has(`${i}-${j}`)) continue;
      if (data[i][j] === 9) count++;
    }
  }
  return count;
};

let flashes = 0;

const increaseGrid = (data) => {
  for (let i in data) {
    for (let j in data[i]) {
      if (data[i][j] === 9) continue;
      data[i][j]++;
    }
  }
};

const updateGrid = (data) => {
  data.forEach((l, i) => {
    l.forEach((char, j) => {
      if (char === -1) return;
      const element = document.getElementById(`${i}-${j}`);
      element.style.opacity = +char / 10;
      element.textContent = char;
    });
  });
};

const main = async (data) => {
  let i = 0;
  while (true) {
    await checkForFlashes(data);
    increaseGrid(data);
    i++;
    if (allZeroes(data)) break;
    updateGrid(data);
    await wait(100);

    document.getElementById("steps").textContent = i;
  }
};
