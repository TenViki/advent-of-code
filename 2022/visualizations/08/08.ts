const defaultValue = `30373
25512
65332
33549
35390`;
const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const textarea = document.querySelector("textarea");
textarea!.placeholder = defaultValue;

const randomInput = () => {
  const gridSize = 20;

  // create a grid of grid size and populate it with random numbers
  const grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => Math.floor(Math.random() * 10))
  );

  textarea!.value = grid.map((row) => row.join("")).join("\n");
};

let speed = 200;

const grid = document.getElementById("grid")!;

const visibleTrees = new Set<string>();

const populateGrid = (input: number[][]) => {
  grid.innerHTML = "";
  for (const row in input) {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row");

    for (const col in input[row]) {
      const colEl = document.createElement("span");
      colEl.classList.add("col");
      colEl.id = `tree-${row}:${col}`;
      colEl.textContent = input[row][col].toString();
      rowEl.appendChild(colEl);
    }

    grid.appendChild(rowEl);
  }
};

const runPart1 = async () => {
  const grid = (textarea!.value || defaultValue)
    .split("\n")
    .map((row) => row.split("").map((col) => parseInt(col)));

  populateGrid(grid);

  const eye1 = document.getElementById("eye-1")!;
  const eye2 = document.getElementById("eye-2")!;

  eye1.style.display = "block";
  eye2.style.display = "block";

  for (let y = 0; y < grid.length; y++) {
    const sEl = document.getElementById(`tree-${y}:0`);
    eye1.style.top = `${sEl!.offsetTop}px`;
    eye2.style.top = `${sEl!.offsetTop}px`;
    eye1.style.left = "-1rem";
    eye2.style.right = "-1rem";

    const row = grid[y];
    let max = -1;
    for (let x = 0; x < row.length; x++) {
      if (row[x] > max) {
        visibleTrees.add(`${x},${y}`);
        document.getElementById(`tree-${y}:${x}`)!.classList.add("visible");
        max = row[x];
      }
    }

    max = -1;
    for (let x = row.length - 1; x >= 0; x--) {
      if (row[x] > max) {
        visibleTrees.add(`${x},${y}`);
        document.getElementById(`tree-${y}:${x}`)!.classList.add("visible");
        max = row[x];
      }
    }

    await wait(speed);
  }

  eye1.style.top = "unset";
  eye2.style.top = "unset";
  eye1.style.left = "unset";
  eye2.style.right = "unset";

  for (let x = 0; x < grid[0].length; x++) {
    const sEl = document.getElementById(`tree-0:${x}`);
    eye1.style.left = `${sEl!.offsetLeft}px`;
    eye2.style.left = `${sEl!.offsetLeft}px`;
    eye1.style.top = "-1rem";
    eye2.style.bottom = "-1rem";

    let max = -1;
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] > max) {
        visibleTrees.add(`${x},${y}`);
        document.getElementById(`tree-${y}:${x}`)!.classList.add("visible");
        max = grid[y][x];
      }
    }

    max = -1;
    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y][x] > max) {
        visibleTrees.add(`${x},${y}`);
        document.getElementById(`tree-${y}:${x}`)!.classList.add("visible");
        max = grid[y][x];
      }
    }

    await wait(speed);
  }

  eye1.style.left = "unset";
  eye2.style.left = "unset";
  eye1.style.top = "unset";
  eye2.style.bottom = "unset";

  eye1.style.display = "none";
  eye2.style.display = "none";

  document.getElementById(
    "output"
  )!.textContent = `Visible trees: ${visibleTrees.size.toString()}`;
};

const stats = document.getElementById("stats");

const getTreeViewScore = async (
  x: number,
  y: number,
  grid: number[][],
  w = false
) => {
  document.getElementById(`tree-${y}:${x}`)!.classList.add("selected");
  const treeValue = grid[y][x];

  let scoreTop = 0;
  for (let i = y - 1; i >= 0; i--) {
    document.getElementById(`tree-${i}:${x}`)!.classList.add("viewing");
    if (treeValue > grid[i][x]) scoreTop++;
    else {
      scoreTop++;
      break;
    }

    if (w) await wait(speed);
  }

  let scoreBottom = 0;
  for (let i = y + 1; i < grid.length; i++) {
    document.getElementById(`tree-${i}:${x}`)!.classList.add("viewing");
    if (treeValue > grid[i][x]) scoreBottom++;
    else {
      scoreBottom++;
      break;
    }

    if (w) await wait(speed);
  }

  let scoreLeft = 0;
  for (let i = x - 1; i >= 0; i--) {
    document.getElementById(`tree-${y}:${i}`)!.classList.add("viewing");
    if (treeValue > grid[y][i]) scoreLeft++;
    else {
      scoreLeft++;
      break;
    }

    if (w) await wait(speed);
  }

  let scoreRight = 0;
  for (let i = x + 1; i < grid[y].length; i++) {
    document.getElementById(`tree-${y}:${i}`)!.classList.add("viewing");
    if (treeValue > grid[y][i]) scoreRight++;
    else {
      scoreRight++;
      break;
    }

    if (w) await wait(speed);
  }

  if (!w)
    stats!.textContent = `(${x}, ${y}) = ${scoreTop}; ${scoreBottom}; ${scoreLeft}; ${scoreRight} -> ${
      scoreTop * scoreBottom * scoreLeft * scoreRight
    }`;

  return scoreTop * scoreBottom * scoreLeft * scoreRight;
};

const runPart2 = async () => {
  const grid = (textarea!.value || defaultValue)
    .split("\n")
    .map((row) => row.split("").map((col) => parseInt(col)));

  populateGrid(grid);

  document.getElementById("output")!.textContent = "";

  let max = 0;
  let [maxX, maxY] = [0, 0];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const score = await getTreeViewScore(x, y, grid);
      if (score > max) {
        max = score;
        [maxX, maxY] = [x, y];
      }

      await wait(speed);

      document.querySelectorAll(".selected, .viewing").forEach((el) => {
        el.classList.remove("selected", "viewing");
      });
    }
  }

  document.getElementById("output")!.textContent = `Max score: ${max}`;
  stats!.textContent = "";
  getTreeViewScore(maxX, maxY, grid, true);
};

export {};
