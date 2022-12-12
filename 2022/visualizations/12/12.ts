let defaultValue = "";
const textarea = document.querySelector("textarea");

(async () => {
  const req = await fetch("./default.txt");
  defaultValue = await req.text();
  textarea!.placeholder = defaultValue;
})();

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let speed = 200;

const gridEl = document.querySelector("#grid") as HTMLDivElement;

const run = async () => {
  const heightMap: {
    value: number;
    label: string;
  }[][] = [];
  let startPos = { x: 0, y: 0 };
  let endPos = { x: 0, y: 0 };
  const text = textarea!.value || defaultValue;

  const lines = text.split("\n").map((line) => line.trim().split(""));

  const populateGrid = (
    grid: {
      value: number;
      label: string;
    }[][]
  ) => {
    gridEl.innerHTML = "";

    grid.forEach((row, y) => {
      const rowEl = document.createElement("div");
      rowEl.classList.add("row");
      row.forEach((cell, x) => {
        const cellEl = document.createElement("div");
        cellEl.classList.add("cell");
        if (x === startPos.x && y === startPos.y) cellEl.classList.add("start");
        if (x === endPos.x && y === endPos.y) cellEl.classList.add("end");
        cellEl.innerText = cell.label;
        cellEl.id = `cell-${x}:${y}`;
        rowEl.appendChild(cellEl);
      });
      gridEl.appendChild(rowEl);
    });
  };

  lines.forEach((line, y) => {
    heightMap.push(
      line.map((c, x) => {
        if (c === "S") {
          startPos = { x, y };
          return {
            value: 0,
            label: "S",
          };
        }
        if (c === "E") {
          endPos = { x, y };
          return {
            value: 27,
            label: "E",
          };
        }
        return {
          value: c.charCodeAt(0) - 96,
          label: c,
        };
      })
    );
  });

  console.log(heightMap);
  populateGrid(heightMap);

  let queue = [
    {
      x: startPos.x,
      y: startPos.y,
      nestage: 0,
      path: [],
    },
  ];

  let final;

  const visited: Set<string> = new Set();

  let currentNestage = 0;

  while (queue.length > 0) {
    const position = queue.shift()!;
    const key = `${position.x}:${position.y}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (position.x === endPos.x && position.y === endPos.y) {
      final = position;
      console.log("Reached final position");
      break;
    }

    const currentHeight = heightMap[position.y][position.x].value;

    if (
      position.y > 0 &&
      heightMap[position.y - 1][position.x].value - currentHeight <= 1
    ) {
      queue.push({
        x: position.x,
        y: position.y - 1,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }

    if (
      position.y < heightMap.length - 1 &&
      heightMap[position.y + 1][position.x].value - currentHeight <= 1
    ) {
      queue.push({
        x: position.x,
        y: position.y + 1,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }

    if (
      position.x > 0 &&
      heightMap[position.y][position.x - 1].value - currentHeight <= 1
    ) {
      queue.push({
        x: position.x - 1,
        y: position.y,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }

    if (
      position.x < heightMap[0].length - 1 &&
      heightMap[position.y][position.x + 1].value - currentHeight <= 1
    ) {
      queue.push({
        x: position.x + 1,
        y: position.y,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }

    if (position.nestage > currentNestage) {
      currentNestage = position.nestage;
      const keysArr = Array.from(visited.keys());

      for (const key of keysArr) {
        const cell = document.getElementById(`cell-${key}`)!;
        cell.classList.add("visited");
      }

      await wait(speed / 3);
    }
  }

  queue = [
    {
      x: endPos.x,
      y: endPos.y,
      nestage: 0,
      path: [],
    },
  ];

  let final2;
  visited.clear();

  while (queue.length > 0) {
    const position = queue.shift()!;
    const key = `${position.x}:${position.y}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (heightMap[position.y][position.x].value === 1) {
      final2 = position;
      console.log("Reached final position");
      break;
    }

    const currentHeight = heightMap[position.y][position.x].value;

    if (
      position.y > 0 &&
      currentHeight - heightMap[position.y - 1][position.x].value <= 1
    ) {
      queue.push({
        x: position.x,
        y: position.y - 1,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }

    if (
      position.y < heightMap.length - 1 &&
      currentHeight - heightMap[position.y + 1][position.x].value <= 1
    ) {
      queue.push({
        x: position.x,
        y: position.y + 1,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }

    if (
      position.x > 0 &&
      currentHeight - heightMap[position.y][position.x - 1].value <= 1
    ) {
      queue.push({
        x: position.x - 1,
        y: position.y,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }

    if (
      position.x < heightMap[0].length - 1 &&
      currentHeight - heightMap[position.y][position.x + 1].value <= 1
    ) {
      queue.push({
        x: position.x + 1,
        y: position.y,
        nestage: position.nestage + 1,
        path: [...position.path, key],
      });
    }
  }

  console.log(final, final2);

  const output = document.getElementById("wrapper")!;

  const part1 = async () => {
    for (const i in final.path) {
      const cell = document.getElementById(`cell-${final.path[+i]}`)!;
      const after = document.getElementById(`cell-${final.path[+i + 1]}`)!;

      if (!after) {
        break;
      }

      const lineToAdd = document.createElement("div");

      // make the line connecting centers of the two elements
      const x1 = cell.offsetLeft + cell.offsetWidth / 3;
      const y1 = cell.offsetTop + cell.offsetHeight / 3;
      const x2 = after.offsetLeft + after.offsetWidth / 3;
      const y2 = after.offsetTop + after.offsetHeight / 3;

      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

      lineToAdd.classList.add("line");
      lineToAdd.style.width = `${length}px`;
      lineToAdd.style.transform = `rotate(${angle}deg) `;
      lineToAdd.style.left = `${x1}px`;
      lineToAdd.style.top = `${y1}px`;

      output.appendChild(lineToAdd);
      await wait(speed / 10);
    }
  };

  const part2 = async () => {
    for (const i in final2.path) {
      const cell = document.getElementById(`cell-${final2.path[+i]}`)!;
      const after = document.getElementById(`cell-${final2.path[+i + 1]}`)!;

      if (!after) {
        break;
      }

      const lineToAdd = document.createElement("div");

      // make the line connecting centers of the two elements
      const x1 = cell.offsetLeft + (cell.offsetWidth / 3) * 2;
      const y1 = cell.offsetTop + (cell.offsetHeight / 3) * 2;
      const x2 = after.offsetLeft + (after.offsetWidth / 3) * 2;
      const y2 = after.offsetTop + (after.offsetHeight / 3) * 2;

      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

      lineToAdd.classList.add("line");
      lineToAdd.classList.add("line-2");
      lineToAdd.style.width = `${length}px`;
      lineToAdd.style.transform = `rotate(${angle}deg) `;
      lineToAdd.style.left = `${x1}px`;
      lineToAdd.style.top = `${y1}px`;

      output.appendChild(lineToAdd);
      await wait(speed / 10);
    }
  };

  part1();
  part2();
};

export {};
