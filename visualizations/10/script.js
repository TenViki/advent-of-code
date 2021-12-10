const finishedTable = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const wrongTable = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const getSum = (chars) => {
  let sum = 0;
  chars.forEach((char) => {
    sum *= 5;
    sum += finishedTable[char];
  });

  return sum;
};

const run = async () => {
  await wait(4000);
  const fetched = await fetch("./data.txt");
  const data = await (await fetched.text()).split("\r\n");

  const html = data.map((l, i) => {
    let line = `<div id="${i}">`;
    l.split("").forEach((char, j) => {
      line += `<span id="${i}-${j}" class="character">${char}</span>`;
    });
    line += `<span class="complete" id="c-${i}" ></span><span class="score" id="s-${i}" ></span></div>`;
    return line;
  });

  document.getElementById("current").innerHTML = html.join("");

  main(data);
};

const clearColors = () => {
  const spans = document.querySelectorAll(".character:not(.wrong)");
  for (const span of spans) {
    span.style.color = "";
  }
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const charStackToCompletetion = (charStack) => {
  return charStack
    .slice()
    .reverse()
    .map((c) => {
      if (c === "[") return "]";
      if (c === "{") return "}";
      if (c === "<") return ">";
      if (c === "(") return ")";
      return ")";
    })
    .join("");
};

const main = async (data) => {
  let p1 = 0;
  const p2 = [];
  for (let i = 0; i < data.length; i++) {
    let wrongFound = false;
    let charStack = [];
    let wrong = "";

    for (let j = 0; j < data[i].length; j++) {
      const char = data[i][j];
      if (wrongFound) continue;
      const span = document.getElementById(`${i}-${j}`);
      clearColors();
      span.style.color = `white`;
      await wait(60);
      clearColors();

      if (char === "[" || char === "{" || char === "<" || char === "(") {
        charStack.push(char);
      }

      if (char === "]") {
        if (charStack[charStack.length - 1] === "[") {
          charStack.pop();
        } else {
          wrongFound = true;
          wrong = "]";
        }
      }

      if (char === "}") {
        if (charStack[charStack.length - 1] === "{") {
          charStack.pop();
        } else {
          wrongFound = true;
          wrong = "}";
        }
      }

      if (char === ">") {
        if (charStack[charStack.length - 1] === "<") {
          charStack.pop();
        } else {
          wrongFound = true;
          wrong = ">";
        }
      }

      if (char === ")") {
        if (charStack[charStack.length - 1] === "(") {
          charStack.pop();
        } else {
          wrongFound = true;
          wrong = ")";
        }
      }

      if (wrongFound) span.classList.add("wrong");

      document.getElementById("stack").innerHTML = charStack.join("");

      if (!wrongFound)
        document.getElementById(`c-${i}`).textContent =
          charStackToCompletetion(charStack);
    }

    if (wrongFound) {
      document.getElementById(`c-${i}`).textContent = "";
      document.getElementById(`s-${i}`).textContent = wrongTable[wrong];
      p1 += wrongTable[wrong];
      document.getElementById("part1").innerHTML = p1;
    } else {
      const completion = charStackToCompletetion(charStack).split("");
      document.getElementById(`s-${i}`).textContent = getSum(completion);
      p2.push(getSum(completion));
      p2.sort((a, b) => a - b);
      document.getElementById("part2").innerHTML =
        p2[Math.floor(p2.length / 2)];
    }
  }

  document.getElementById("stack").innerHTML = "";
};

run();
