let defaultValue = "";
const textarea = document.querySelector("textarea");

interface Sensor {
  x: number;
  y: number;
  range: number;
  color: string;
  closestBeacon: {
    x: number;
    y: number;
  };
}

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
  sensors: Sensor[],
  beacons: Set<string>
) => {
  for (let y = pos.minY; y <= pos.maxY; y++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let x = pos.minX; x <= pos.maxX; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${x}:${y}`;

      cell.setAttribute("cell-colors", "[]");

      if (beacons.has(`${x},${y}`)) {
        cell.classList.add("beacon");
        cell.textContent = "B";
      }

      if (sensors.some((s) => s.x === x && s.y === y)) {
        cell.classList.add("sensor");
        cell.textContent = "S";
        cell.style.color = sensors.find((s) => s.x === x && s.y === y)!.color;
      }

      row.appendChild(cell);
    }

    grid.appendChild(row);
  }
};

// colors from flatuicolors
const availableColors = [
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
  "#95a5a6",
  "#f39c12",
  "#d35400",
  "#c0392b",
  "#bdc3c7",
  "#7f8c8d",
];

const bounds = document.getElementById("bounds")!;

const run = async () => {
  grid.innerHTML = "";
  const text = textarea!.value || defaultValue;
  const lines = text.split("\n");

  const yVal = document.querySelector("#y-val") as HTMLInputElement;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const sensors: Sensor[] = [];
  const beacons = new Set<string>();

  for (const line of lines) {
    const [x, y, xb, yb] = line?.match(/(-)*\d+/g)?.map(Number) ?? [];

    minX = Math.min(minX, x, xb);
    maxX = Math.max(maxX, x, xb);

    minY = Math.min(minY, y, yb);
    maxY = Math.max(maxY, y, yb);

    sensors.push({
      x,
      y,
      color:
        availableColors[Math.floor(Math.random() * availableColors.length)],
      range: Math.abs(x - xb) + Math.abs(y - yb),
      closestBeacon: {
        x: xb,
        y: yb,
      },
    });

    beacons.add(`${xb},${yb}`);
  }

  populateGrid(
    {
      minX,
      maxX,
      minY,
      maxY,
    },
    sensors,
    beacons
  );

  const leftTop = document.getElementById(`cell-${0}:${0}`)!;

  bounds.style.left = `${leftTop.offsetLeft - 4}px`;
  bounds.style.top = `${leftTop.offsetTop - 4}px`;

  const bottomRight = document.getElementById(
    `cell-${yVal.value}:${yVal.value}`
  )!;

  bounds.style.width = `${
    bottomRight.offsetLeft - leftTop.offsetLeft + bottomRight.offsetWidth + 8
  }px`;
  bounds.style.height = `${
    bottomRight.offsetTop - leftTop.offsetTop + bottomRight.offsetHeight + 8
  }px`;

  for (const sensor of sensors) {
    console.log("sensor", sensor);
    const queue = [
      {
        x: sensor.x,
        y: sensor.y,
        distance: 0,
      },
    ];
    const visited = new Set<string>();

    let lastDist = 0;

    while (queue.length) {
      const { x, y, distance } = queue.shift()!;

      if (distance !== lastDist) {
        await wait(speed);
        lastDist = distance;
      }

      if (distance > sensor.range) {
        break;
      }

      if (x === sensor.closestBeacon.x && y === sensor.closestBeacon.y) {
        continue;
      }

      if (visited.has(`${x},${y}`)) {
        continue;
      }

      const el = document.getElementById(`cell-${x}:${y}`);
      if (el) {
        if (
          !el.classList.contains("beacon") &&
          !el.classList.contains("sensor")
        ) {
          const colors = el.getAttribute("cell-colors")!;
          const parsedColors = JSON.parse(colors);

          parsedColors.push(sensor.color);

          // update cell color
          el.setAttribute("cell-colors", JSON.stringify(parsedColors));

          let colorString = [];
          for (let i = 0; i < parsedColors.length; i++) {
            colorString.push(
              `${parsedColors[i]} ${(i / parsedColors.length) * 100}% ${
                ((i + 1) / parsedColors.length) * 100
              }%`
            );
          }

          console.log(`linear-gradient(90deg, ${colorString.join(",")})")`);

          el.style.background = `linear-gradient(90deg, ${colorString.join(
            ","
          )})`;
        }
      }

      visited.add(`${x},${y}`);

      queue.push(
        { x: x + 1, y, distance: distance + 1 },
        { x: x - 1, y, distance: distance + 1 },
        { x: x, y: y + 1, distance: distance + 1 },
        { x: x, y: y - 1, distance: distance + 1 }
      );
    }
    await wait(speed);
  }
};

export {};
