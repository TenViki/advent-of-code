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

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const clearColors = () => {
  document.querySelectorAll(".character").forEach((c) => {
    c.style.color = "";
  });
};

const besins = [];
const updateBesins = (size, color) => {
  besins.push([size, color]);
  besins.sort((a, b) => b[0] - a[0]);
  let html = "";

  besins.forEach((size) => {
    html += `<div class="${size[1]} record" >${size[0]}</div>`;
  });

  document.getElementById("besins").innerHTML = html;
};

const main = async (grid) => {
  const lowPoints = [];

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const point = row[j];
      document.getElementById(`${i}-${j}`).style.color = "#3498db";
      let lowest = true;

      if (point === 9) {
        document.getElementById(`${i}-${j}`).classList.add("border");
        continue;
      }

      if (i > 0 && grid[i - 1][j] <= point) {
        lowest = false;
      }
      if (i < grid.length - 1 && grid[i + 1][j] <= point) {
        lowest = false;
      }

      if (j > 0 && grid[i][j - 1] <= point) {
        lowest = false;
      }
      if (j < grid[i].length - 1 && grid[i][j + 1] <= point) {
        lowest = false;
      }

      if (lowest) {
        lowPoints.push(point);
        document.getElementById(`${i}-${j}`).style.color = "#27ae60";
        document.getElementById(`${i}-${j}`).classList.add("lowest");
      }
      await wait(2);
      clearColors();

      if (!lowest) continue;
      const besinColor = `color-${Math.floor(Math.random() * 13)}`;

      checkBesins(i, j, grid, besinColor).then((size) =>
        updateBesins(size, besinColor)
      );
    }
  }

  console.log(besins);
};

const checkBesins = async (i, j, grid, besinColor) => {
  const visited = new Set();
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const toCheck = [[i, j]];

  while (toCheck.length) {
    const [i_, j_] = toCheck.shift();

    if (visited.has(`${i_}-${j_}`)) continue;
    if (i_ < 0 || j_ < 0 || i_ >= grid.length || j_ >= grid[i_].length)
      continue;
    if (grid[i_][j_] === 9) {
      document.getElementById(`${i_}-${j_}`).classList.add("border");
      continue;
    }
    await wait(10);

    visited.add(`${i_}-${j_}`);
    document.getElementById(`${i_}-${j_}`).classList.add("inbesin");
    document.getElementById(`${i_}-${j_}`).classList.add(besinColor);
    toCheck.push(...directions.map(([x, y]) => [i_ + x, j_ + y]));
  }

  return visited.size;
};
