let targetStart;
let targetEnd;
let maxY;

const load = () => {
  const string = document.getElementById("input").value ? document.getElementById("input").value : "target area: x=20..30, y=-10..-5";
  const data = string
    .replaceAll("..", ",")
    .replaceAll("target area: x=", "")
    .replaceAll(" ", "")
    .replaceAll("y=", "")
    .split(",")
    .map(Number);

  targetStart = [data[0], data[2]];
  targetEnd = [data[1], data[3]];

  clearGrid();
};

const clearGrid = () => {
  const minY = Math.min(targetStart[1], targetEnd[1]);
  maxY = (minY * (minY + 1)) / 2;

  let html = "";

  const showpositive = document.getElementById("showpositive").checked;

  for (let i = showpositive ? maxY : 20; i >= minY; i--) {
    html += `<div class="row"><span class="row-label">${i}</span>`;
    for (let j = 0; j < Math.max(targetStart[0], targetEnd[0]); j++) {
      let className = "nothing";
      let insert = ".";

      if (
        i <= Math.max(targetStart[1], targetEnd[1]) &&
        j >= Math.min(targetStart[0], targetEnd[0]) &&
        j <= Math.max(targetStart[0], targetEnd[0]) &&
        i >= Math.min(targetStart[1], targetEnd[1])
      ) {
        insert = "T";
        className = "target";
      }

      if (j === 0 && i === 0) {
        className = "submarine";
        insert = "S";
      }

      html += `<span class="${className}" onmouseover="doesTrajectoryCrossTarget(${j}, ${i})" id="${i}-${j}">${insert}</span>`;
    }
    html += `</div>`;
  }

  document.getElementById("grid").innerHTML = html;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const markChar = (x, y, className, char) => {
  const el = document.getElementById(`${y}-${x}`);
  if (el) {
    el.classList.add(className);
    if (char) el.innerHTML = char;
  }
};

const doesTrajectoryCrossTarget = async (vX, vY) => {
  // clearGrid();

  document.querySelectorAll(".trajectory").forEach((el) => {
    el.classList.remove("trajectory");
    el.classList.remove("success");
    if (el.classList.contains("target")) el.textContent = "T";
    else if (el.classList.contains("submarine")) el.textContent = "S";
    else el.textContent = ".";
  });

  let x = 0;
  let y = 0;
  let result = undefined;
  let maxY = 0;

  let velY = vY;
  let velX = vX;
  let path = 0;

  while (result === undefined) {
    x += velX;
    y += velY;
    path++;

    if (velX > 0) velX--;
    if (velX < 0) velX++;

    if (y > maxY) maxY = y;

    velY--;

    if (x >= targetStart[0] && x <= targetEnd[0] && y >= targetStart[1] && y <= targetEnd[1]) {
      result = true;
    } else if (x > targetEnd[0] + 20 || y < targetStart[1] - 20) {
      result = false;
    }

    markChar(x, y, "trajectory", "#");
    console.log("wait");
  }

  if (result) {
    markSuccess();
  }

  document.getElementById("hits").textContent = result ? "Yes" : "no";
  document.getElementById("len").textContent = path;
  document.getElementById("pos").textContent = `x: ${vX}, y: ${vY}`;
  document.getElementById("max").textContent = maxY;

  return [result, maxY];
};

const markSuccess = () => {
  const elements = document.querySelectorAll(".trajectory");
  elements.forEach((el) => {
    el.classList.add("success");
  });
};

const main = async () => {
  load();
  for (let j = Math.min(targetStart[1], targetEnd[1]); j < maxY; j++) {
    for (let i = 0; i < Math.max(targetStart[0], targetEnd[0]); i++) {
      console.log(i, j);
      const [crosses, y, failsY, failsX] = await doesTrajectoryCrossTarget(i, j);
      if (crosses) markSuccess();
      await wait(0);
      clearGrid();
    }
  }
};

// main();
