let defaultValue = "";
const textarea = document.querySelector("textarea");

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const req = await fetch("./default.txt");
  defaultValue = await req.text();
  textarea!.placeholder = defaultValue;
})();

let speed = 200;

const grid = document.getElementById("grid")!;
const wrapper = document.getElementById("sands")!;

const populateGrid = (
  pos: {
    minY: number;
    maxY: number;
    minX: number;
    maxX: number;
  },
  rockPositions: Set<string>
) => {
  for (let y = pos.minY; y <= pos.maxY; y++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let x = pos.minX; x <= pos.maxX; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${x}:${y}`;
      if (rockPositions.has(`${x},${y}`)) {
        cell.classList.add("rock");
        cell.textContent = "#";
      }

      if (x === 500 && y === 0) {
        cell.classList.add("start");
        cell.textContent = "+";
      }

      row.appendChild(cell);
    }

    grid.appendChild(row);
  }
};

const run = async () => {
  grid.innerHTML = "";
  const rockPositions = new Set<string>();
  let minY = 0;
  let maxY = 0;
  let minX = Infinity;
  let maxX = -Infinity;

  const lines = (textarea!.value || defaultValue)
    .split("\n")
    .map((line) => line.trim());

  for (const line of lines) {
    const pathPoints = line.split(" -> ");

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const [x1, y1] = pathPoints[i].split(",").map(Number);
      const [x2, y2] = pathPoints[i + 1].split(",").map(Number);

      maxY = Math.max(maxY, y1, y2);
      minY = Math.min(minY, y1, y2);
      minX = Math.min(minX, x1, x2);
      maxX = Math.max(maxX, x1, x2);

      if (x1 == x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let y = minY; y <= maxY; y++) {
          rockPositions.add(`${x1},${y}`);
        }
      } else {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let x = minX; x <= maxX; x++) {
          rockPositions.add(`${x},${y1}`);
        }
      }
    }
  }

  populateGrid(
    { minY, maxY: maxY + 1, minX: minX - 1, maxX: maxX + 1 },
    rockPositions
  );

  await wait(100);
  const outputEl = document.querySelector(".output") as HTMLDivElement;
  if (grid.offsetHeight > outputEl.offsetHeight) {
    outputEl.classList.add("top");
  }

  if (grid.offsetWidth > outputEl.offsetWidth) {
    outputEl.classList.add("left");
  }

  const sandPositions = new Set<string>();

  let end = false;

  while (!end) {
    const sand = [500, 0] as [number, number];

    const sandEl = document.createElement("div");
    sandEl.textContent = "o";
    sandEl.classList.add("sand");
    wrapper.appendChild(sandEl);

    const updateSandPosition = (x: number, y: number) => {
      const cell = document.getElementById(`cell-${x}:${y}`)!;
      sandEl.style.left = `${cell.offsetLeft}px`;
      sandEl.style.top = `${cell.offsetTop}px`;
    };

    document.getElementById("sand-units").textContent =
      sandPositions.size.toString();

    updateSandPosition(...sand);

    // move sand
    while (!end) {
      const [x, y] = sand;

      await wait(speed);

      if (y > maxY) {
        sandEl.style.top = `${grid.offsetHeight + 50}px`;
        sandEl.classList.add("end");
        end = true;
        continue;
      }

      if (
        !rockPositions.has(`${x},${y + 1}`) &&
        !sandPositions.has(`${x},${y + 1}`) &&
        y < maxY + 1
      ) {
        sand[1] += 1;
        updateSandPosition(...sand);
        continue;
      }

      if (
        !rockPositions.has(`${x - 1},${y + 1}`) &&
        !sandPositions.has(`${x - 1},${y + 1}`) &&
        y < maxY + 1
      ) {
        sand[0] -= 1;
        sand[1] += 1;
        updateSandPosition(...sand);
        continue;
      }

      if (
        !rockPositions.has(`${x + 1},${y + 1}`) &&
        !sandPositions.has(`${x + 1},${y + 1}`) &&
        y < maxY + 1
      ) {
        sand[0] += 1;
        sand[1] += 1;
        updateSandPosition(...sand);
        continue;
      }

      updateSandPosition(...sand);
      sandPositions.add(`${x},${y}`);
      break;
    }
  }
};

export {};
