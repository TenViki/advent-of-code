let pairs = {};
let instructions = {};
let letters = {};
let chart;

const countLetters = (string) => {
  const ls = {};
  for (const letter of string) {
    if (ls[letter]) {
      ls[letter]++;
    } else {
      ls[letter] = 1;
    }
  }
  return ls;
};

const run = async () => {
  const fetched = await fetch("./data.txt");
  const input = await fetched.text();

  const [template, rawInstructions] = input.split("\r\n\r\n");

  instructions = rawInstructions.split("\r\n").map((instruction) => {
    const [from, to] = instruction.split(" -> ");
    return { from, to };
  });

  letters = countLetters(template);

  for (let i = 0; i < template.length - 1; i++) {
    const momentaryString = template.substring(i, i + 2);
    if (pairs[momentaryString]) pairs[momentaryString]++;
    else pairs[momentaryString] = 1;
  }
  console.log(pairs);

  const data = {
    labels: Object.keys(pairs),
    datasets: [
      {
        label: "",
        data: Object.values(pairs),
        backgroundColor: [
          "#1abc9c",
          "#16a085",
          "#2ecc71",
          "#27ae60",
          "#3498db",
          "#2980b9",
          "#9b59b6",
          "#8e44ad",
          "#34495e",
          "#2c3e50",
          "#f1c40f",
          "#f39c12",
          "#e67e22",
          "#d35400",
          "#e74c3c",
          "#c0392b",
          "#ecf0f1",
          "#bdc3c7",
          "#95a5a6",
          "#7f8c8d",
        ],
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  chart = new Chart(document.getElementById("chart"), config);
  document.getElementById("template").innerHTML = template;
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const updateLetters = (steps) => {
  let html = "";
  for (const letter of Object.keys(letters)) {
    html += `<div class="letter">${letter}: <span class="number">${letters[letter]}</div>`;
  }
  document.getElementById("letters").innerHTML = html;
  document.getElementById("steps").innerHTML = steps;
};

const getResult = () => {
  let max = 0;
  let min = Infinity;

  for (const key of Object.keys(letters)) {
    if (letters[key] > max) {
      max = letters[key];
    }
    if (letters[key] < min) {
      min = letters[key];
    }
  }

  return max - min;
};

const main = async () => {
  document.getElementById("start").remove();
  for (let i = 0; i < 40; i++) {
    const newPairs = {};

    for (const pair of Object.keys(pairs)) {
      const count = pairs[pair];

      const to = instructions.find((instruction) => instruction.from === pair);

      const [a, b] = pair.split("");

      if (newPairs[a + to.to]) {
        newPairs[a + to.to] += count;
      } else {
        newPairs[a + to.to] = count;
      }

      if (newPairs[to.to + b]) {
        newPairs[to.to + b] += count;
      } else {
        newPairs[to.to + b] = count;
      }

      if (letters[to.to]) {
        letters[to.to] += count;
      } else {
        letters[to.to] = count;
      }
    }
    chart.data.datasets[0].data = Object.values(newPairs);
    chart.data.labels = Object.keys(newPairs);
    chart.update();
    updateLetters(i + 1);
    pairs = newPairs;

    if (i === 9) document.getElementById("part1").innerHTML = getResult();
    await wait(i < 10 ? 1000 : 250);
  }
  document.getElementById("part2").innerHTML = getResult();
};

run();
