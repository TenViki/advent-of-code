let grid = [];

const run = async () => {
  const fetched = await fetch("./data.txt");
  const data = await (await fetched.text()).split("\r\n");

  const html = data.map((l, i) => {
    let line = `<div id="${i}">`;
    l.split("").forEach((char, j) => {
      line += `<span id="${i}-${j}" class="character">${char}<span class="weight" id="d-${i}-${j}"></span></span>`;
    });
    line += "</div>";
    return line;
  });

  document.getElementById("current").innerHTML = html.join("");
  // document.getElementById("run").remove();

  grid = data.map((l) => l.split("").map(Number));

  document.getElementById("start").remove();
  main();
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getNeighbors = (x, y) => {
  const neighbors = [];
  if (x > 0) neighbors.push([x - 1, y]);
  if (x < grid.length - 1) neighbors.push([x + 1, y]);
  if (y > 0) neighbors.push([x, y - 1]);
  if (y < grid[0].length - 1) neighbors.push([x, y + 1]);
  return neighbors;
};

const clear = (cl) => {
  document.querySelectorAll("." + cl).forEach((e) => e.classList.remove(cl));
};

const main = async () => {
  const cost = grid.map((row) => row.map(() => Infinity));
  cost[0][0] = 0;

  const queue = [[0, 0]];
  while (queue.length) {
    const current = queue.shift();
    const neighbors = getNeighbors(current[0], current[1]);

    for (const neighbor of neighbors) {
      const neighborCost = cost[neighbor[0]][neighbor[1]];
      const costToNeighbor = cost[current[0]][current[1]] + grid[neighbor[0]][neighbor[1]];

      document.getElementById(`${current[0]}-${current[1]}`).classList.add("visiting");

      if (neighborCost > costToNeighbor) {
        cost[neighbor[0]][neighbor[1]] = costToNeighbor;
        document.getElementById(`${neighbor[0]}-${neighbor[1]}`).classList.add("visiting-h");

        document.getElementById(`d-${neighbor[0]}-${neighbor[1]}`).innerHTML = costToNeighbor;
        queue.push(neighbor);
        // await wait(100);
      }

      await wait(0);
      clear("visiting");
      clear("visiting-h");
    }
  }

  let current = [grid.length - 1, grid[0].length - 1];
  const path = [];
  const visited = new Set();
  document.getElementById(`${current[0]}-${current[1]}`).classList.add("path");

  while (current[0] !== 0 || current[1] !== 0) {
    path.push(current);
    visited.add(`${current[0]}-${current[1]}`);

    const neighbors = getNeighbors(current[0], current[1]).filter((n) => !visited.has(`${n[0]}-${n[1]}`));
    const neighborCosts = neighbors.map((n) => cost[n[0]][n[1]]);

    console.log(
      neighborCosts,
      neighborCosts.filter((c) => c < cost[current[0]][current[1]])
    );

    if (neighborCosts.length) {
      current[0] = neighbors[neighborCosts.indexOf(Math.min(...neighborCosts))][0];
      current[1] = neighbors[neighborCosts.indexOf(Math.min(...neighborCosts))][1];
    } else {
      path.pop();
      current = path[path.length - 1];
      break;
    }

    await wait(10);
    document.getElementById(`${current[0]}-${current[1]}`).classList.add("path");
    console.log(current);
  }

  document.getElementById("current").classList.add("done");

  console.log(path);
};
