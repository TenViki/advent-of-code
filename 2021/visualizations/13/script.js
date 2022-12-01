let grid = [];
let folds = [];

const width = window.innerWidth;
const height = window.innerHeight;

const run = async () => {
  const fetched = await fetch("./data.txt");
  const input = await fetched.text();

  const [data, fs] = input.split("\r\n\r\n");
  folds = fs.split("\r\n");
  folds.forEach((fold, i) => {
    document.getElementById("instructions").insertAdjacentHTML("beforeend", `<div id="f-${i}">${fold}</div> `);
  });
  const cords = data.split("\r\n").map((cord) => cord.split(",").map(Number));

  const xArray = data.split("\r\n").map((x) => +x.split(",")[0]);
  const yArray = data.split("\r\n").map((x) => +x.split(",")[1]);

  const xMax = Math.max(...xArray);
  const yMax = Math.max(...yArray);

  grid = new Array(yMax + 1).fill(".").map(() => new Array(xMax + 1).fill("."));

  for (const cord of cords) {
    const [x, y] = cord;
    grid[y][x] = "#";
  }

  let html = "";

  grid.forEach((row, y) => {
    html += `<div class="row" id="${y}">`;
    row.forEach((cell, x) => {
      html += `<span id="${x}-${y}" class="${cell === "." ? "character" : "point"}">${cell}</span>`;
    });
    html += `</div>`;
  });

  document.getElementById("grid").innerHTML = html;
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const removeRows = (from, to) => {
  grid.splice(from, to + 1);
};

const removeCols = (from, to) => {
  grid.forEach((row) => row.splice(from, to + 1));
};

const clearCols = () => {
  document.querySelectorAll(".copy-col").forEach((col) => {
    col.classList.remove("copy-col");
  });
};

const clearRows = () => {
  document.querySelectorAll(".copy-row").forEach((row) => {
    row.classList.remove("copy-row");
  });
};

const getDifference = (value, x) => {
  const positionToMove = value - (x - value);
  return x - positionToMove;
};

const updateGrid = () => {
  let html = "";

  grid.forEach((row, y) => {
    html += `<div class="row" id="${y}">`;
    row.forEach((cell, x) => {
      html += `<span id="${x}-${y}" class="${cell === "." ? "character" : "point"}">${cell}</span>`;
    });
    html += `</div>`;
  });

  document.getElementById("grid").innerHTML = html;
};

const main = async () => {
  document.getElementById("start").remove();
  let count = 0;
  for (const fold of folds) {
    count += 1;
    document.getElementById(`f-${count - 1}`).classList.add("active");
    const [line, value] = fold.split("=");

    if (line.includes("x")) {
      document.querySelectorAll(`[id^="${value}"]`).forEach((cell) => {
        cell.classList.add("active-col");
      });

      for (let i in grid) {
        for (let j = +value + 1; j < grid[i].length; j++) {
          document.getElementById(`${j}-${i}`).classList.add("copy-col");
          if (grid[i][j] === "#") {
            document.getElementById(`${j}-${i}`).style.transform = `translateX(-${getDifference(value, j) * 100}%)`;
            document.getElementById(`${+value - (j - +value)}-${i}`).textContent = "‎ ";

            grid[i][j] = ".";
            grid[i][+value - (j - +value)] = "#";
          }
          await wait(200);
          clearCols();
        }
      }

      removeCols(+value, grid[0].length - 1);
    } else {
      document.getElementById(value).classList.add("active-row");

      for (let i = +value + 1; i <= grid.length - 1; i++) {
        document.getElementById(`${i}`).classList.add("copy-row");
        document.getElementById(`${+value - (i - +value)}`).classList.add("copy-row");

        for (let j = 0; j < grid[i].length; j++) {
          document.getElementById(`${j}-${i}`).classList.add("copy-col");

          if (grid[i][j] === "#") {
            document.getElementById(`${j}-${i}`).style.transform = `translateY(-${getDifference(value, i) * 100}%)`;
            document.getElementById(`${j}-${+value - (i - +value)}`).textContent = "‎ ";

            grid[i][j] = ".";
            grid[+value - (i - +value)][j] = "#";
          }

          await wait(200);
          clearCols();
        }
        clearRows();
      }

      removeRows(+value, grid.length - 1);
    }
    updateGrid();
    document.getElementById(`f-${count - 1}`).remove();
  }
  await wait(200);
  document.getElementById("grid").className = "done";
};

run();
