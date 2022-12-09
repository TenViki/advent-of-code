const defaultValue = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;
const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let speed = 200;
const textarea = document.querySelector("textarea");
textarea!.placeholder = defaultValue;

const grid = document.getElementById("grid")!;

const populateGrid = (
  width: number,
  height: number,
  boundaries: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }
) => {
  grid.innerHTML = "";

  for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let x = boundaries.minX; x <= boundaries.maxX; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `c-${x}:${y}`;

      cell.innerText = " ";

      if (x === 0 && y === 0) {
        cell.innerText = "s";
        cell.classList.add("start");
      }

      row.appendChild(cell);
    }

    grid.appendChild(row);
  }
};

const updateTailPosition = (
  tailingBlock: [number, number],
  headingBlock: [number, number]
) => {
  const [x, y] = tailingBlock;
  const [xh, yh] = headingBlock;

  if (xh == x && Math.abs(y - yh) > 1) {
    if (yh > y) tailingBlock[1]++;
    else tailingBlock[1]--;
  }

  if (yh == y && Math.abs(x - xh) > 1) {
    if (xh > x) tailingBlock[0]++;
    else tailingBlock[0]--;
  }

  if (xh != x && yh != y && !(Math.abs(x - xh) == 1 && Math.abs(y - yh) == 1)) {
    if (Math.abs(y - yh) == 1) {
      if (xh > x) tailingBlock[0]++;
      else tailingBlock[0]--;
      tailingBlock[1] = yh;
    }

    if (Math.abs(x - xh) == 1) {
      if (yh > y) tailingBlock[1]++;
      else tailingBlock[1]--;
      tailingBlock[0] = xh;
    }
  }

  if (Math.abs(xh - x) == 2 && Math.abs(yh - y) == 2) {
    if (xh > x) tailingBlock[0]++;
    else tailingBlock[0]--;
    if (yh > y) tailingBlock[1]++;
    else tailingBlock[1]--;
  }
};

const ropeWrapper = document.getElementById("rope")!;
const ropeElements = [];

const updateRopeElements = (rope: [number, number][]) => {
  const visitedSet = new Set<string>();

  for (const index in rope) {
    const ropeElement = ropeElements[+index];
    const [x, y] = rope[index];

    if (visitedSet.has(`${x}:${y}`)) {
      ropeElement.classList.add("hidden");
    } else {
      ropeElement.classList.remove("hidden");
    }

    visitedSet.add(`${x}:${y}`);

    const cell = document.getElementById(`c-${x}:${y}`)!;

    ropeElement.style.left = `${cell.offsetLeft}px`;
    ropeElement.style.top = `${cell.offsetTop}px`;
  }
};

const instrtuctions = document.getElementById("instructions")!;

const run = async () => {
  document.querySelector("button")!.disabled = true;
  const input = (textarea!.value || defaultValue)
    .split("\n")
    .map((row) => row.trim());

  const bounds = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  };
  const current = {
    x: 0,
    y: 0,
  };

  instrtuctions.innerHTML = "";
  ropeWrapper.innerHTML = "";
  input.forEach((line, i) => {
    const element = document.createElement("div");
    element.classList.add("instruction");
    element.innerText = line;
    element.id = `i-${i}`;
    instrtuctions.appendChild(element);
  });

  for (const line of input) {
    const [direction, distance] = line.split(" ");

    switch (direction) {
      case "R":
        current.x += +distance;
        break;
      case "L":
        current.x -= +distance;
        break;
      case "U":
        current.y -= +distance;
        break;
      case "D":
        current.y += +distance;
        break;
    }

    console.log(current);

    bounds.minX = Math.min(bounds.minX, current.x);
    bounds.minY = Math.min(bounds.minY, current.y);
    bounds.maxX = Math.max(bounds.maxX, current.x);
    bounds.maxY = Math.max(bounds.maxY, current.y);
  }

  console.log(bounds);

  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;

  populateGrid(width, height, bounds);

  const visitedOne = new Set<string>();
  const visitedTwo = new Set<string>();
  const rope = Array.from({ length: 10 }, () => [0, 0]) as [number, number][];

  for (const el in rope) {
    const ropeElement = document.createElement("div");
    ropeElement.classList.add("rope");
    ropeElement.id = `r-${el}`;
    ropeElement.innerText = el === "0" ? "H" : el;
    ropeElements.push(ropeElement);
    ropeWrapper.appendChild(ropeElement);
  }

  for (const lineIndex in input) {
    const line = input[+lineIndex];
    const [direction, distance] = line.split(" ");

    const el = document.getElementById(`i-${lineIndex}`)!;
    el.classList.add("performing");

    for (let c = 0; c < +distance; c++) {
      switch (direction) {
        case "R":
          rope[0][0]++;
          break;
        case "L":
          rope[0][0]--;
          break;
        case "U":
          rope[0][1]--;
          break;
        case "D":
          rope[0][1]++;
          break;
      }

      for (let i = 0; i < rope.length - 1; i++) {
        updateTailPosition(rope[i + 1], rope[i]);

        const el1 = document.getElementById(`c-${rope[1][0]}:${rope[1][1]}`)!;
        el1.classList.add("visited-1");
        el1.textContent = ".";

        const el2 = document.getElementById(`c-${rope[9][0]}:${rope[9][1]}`)!;
        el2.classList.add("visited-2");
        el2.textContent = ".";

        visitedOne.add(rope[9].join(","));
        visitedTwo.add(rope[1].join(","));

        document.querySelector("#part-1 span")!.textContent =
          visitedTwo.size.toString();
        document.querySelector("#part-2 span")!.textContent =
          visitedOne.size.toString();
      }

      updateRopeElements(rope);
      await wait(speed);
    }

    el.classList.remove("performing");
    el.classList.add("done");
  }

  console.log(visitedOne);
  console.log(visitedTwo);

  document.querySelector("button")!.disabled = false;

  ropeElements.forEach((el) => el.classList.add("hidden"));
};

export {};
