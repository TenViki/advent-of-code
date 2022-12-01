const sampleInput = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;

const parseInput = (string) => {
  const [algorithm, data] = string.replaceAll("\r", "").split("\n\n");

  let grid = data.split("\n").map((row) => row.split(""));
  return [algorithm, grid];
};

let algorithm,
  grid,
  environment = ".",
  enhanced = 0;

const texts = ["[Enhance]", "[Enhance!]", "[Enhance!!]", "[ENHANCE!]", "[ENHANCE!!]", "[MORE!!!]"];

const load = () => {
  const input = document.getElementById("input");
  [algorithm, grid] = input.value ? parseInput(input.value) : parseInput(sampleInput);
  enhanced = 0;
  main();
};

const enlarge = () => {
  grid = [
    [environment, ...new Array(grid[0].length + 1).fill(environment)],
    ...grid.map((row) => [environment, ...row, environment]),
    [environment, ...new Array(grid[0].length + 1).fill(environment)],
  ];
};

const update = () => {
  let html = "";
  grid.forEach((row, i) => {
    html +=
      `<div id="g1-${i}">` +
      row.map((cell, j) => `<span class="${cell === "." ? "grey" : ""}" id="g1-${i}-${j}">${cell}</span>`).join("") +
      `</div>`;
  });
  document.getElementById("grid1").innerHTML = html;

  html = "";
  grid.forEach((row, i) => {
    html += `<div id="g2-${i}">` + row.map((cell, j) => `<span class="grey" id="g2-${i}-${j}">.</span>`).join("") + `</div>`;
  });
  document.getElementById("grid2").innerHTML = html;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const enhance = async () => {
  let newGrid = [];

  for (let y = 0; y < grid.length; y++) {
    newGrid[y] = [];
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      let string = "";
      if (y <= 0 || x <= 0) string += environment;
      else string += grid[y - 1][x - 1];

      if (y <= 0) string += environment;
      else string += grid[y - 1][x];

      if (y <= 0 || x >= grid[0].length - 1) string += environment;
      else string += grid[y - 1][x + 1];

      if (x <= 0) string += environment;
      else string += grid[y][x - 1];

      string += cell;

      if (x >= grid[0].length - 1) string += environment;
      else string += grid[y][x + 1];

      if (y >= grid.length - 1 || x <= 0) string += environment;
      else string += grid[y + 1][x - 1];

      if (y >= grid.length - 1) string += environment;
      else string += grid[y + 1][x];

      if (y >= grid.length - 1 || x >= grid[0].length - 1) string += environment;
      else string += grid[y + 1][x + 1];

      const binary = string.replaceAll(".", "0").replaceAll("#", "1");
      const number = parseInt(binary, 2);
      const char = algorithm[number];
      newGrid[y].push(char);
      document.querySelectorAll(".active").forEach((e) => e.classList.remove("active"));
      document.getElementById(`g2-${y}-${x}`).innerHTML = char;
      document.getElementById(`g2-${y}-${x}`).classList.add("active");
      if (char === "#") document.getElementById(`g2-${y}-${x}`).classList.remove("grey");
      document.getElementById(`g1-${y}-${x}`).classList.add("active");
      document.getElementById("bin").innerHTML = string.replaceAll(".", "0").replaceAll("#", "1") + " - " + number;
      document.getElementById(
        "srs"
      ).innerHTML = `${string[0]} ${string[1]} ${string[2]}<br>${string[3]} <span class="active">${string[4]}</span> ${string[5]} -> ${char}<br>${string[6]} ${string[7]} ${string[8]}`;
      await wait(60);
    }
  }

  grid = newGrid;
  document.getElementById("count").innerHTML = countLights();
};

const countLights = () => {
  let count = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell === "#") count++;
    });
  });
  return count;
};

const main = async () => {
  document.getElementById("enhanced").innerHTML = enhanced + 1;
  enlarge();
  update();
  document.getElementById("enhance").setAttribute("disabled", "disabled");
  document.getElementById("run").setAttribute("disabled", "disabled");
  await enhance();
  document.getElementById("enhance").removeAttribute("disabled");
  document.getElementById("run").removeAttribute("disabled");

  if (environment === "." && algorithm[0] === "#") environment = "#";
  else if (environment === "#" && algorithm[511] === ".") environment = ".";

  document.getElementById("enhance").innerHTML = texts[enhanced % texts.length];
  enhanced++;
};
