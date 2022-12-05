const defaultValue = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const textarea = document.querySelector("textarea");
textarea!.placeholder = defaultValue;

let stacks: string[][] = [];
let moves: string[] = [];

const parseInput = (input: string) => {
  stacks = [];
  const [inputStacks, movesInput] = input.replaceAll("\r", "").split("\n\n");
  const init = inputStacks.split("\n");
  init.reverse();

  for (let i = 0; i < init[0].length; i++) {
    const c = init[0][i];
    if (c == " ") continue;

    const stack = [];

    for (let j = 1; j < init.length; j++) {
      if (init[j][i] == " ") break;
      stack.push(init[j][i]);
    }

    stacks.push(stack);
  }

  moves = movesInput.split("\n");
};

let maxStackLength = 0;

const createGrid = (stacks: string[][]) => {
  const grid = document.querySelector("#grid");
  grid!.innerHTML = "";

  maxStackLength = Math.max(maxStackLength, ...stacks.map((s) => s.length));

  for (const stack of stacks) {
    const stackDiv = document.createElement("div");
    stackDiv.classList.add("stack");
    stackDiv.id = `stack-${stacks.indexOf(stack) + 1}`;

    const stackNumber = stacks.indexOf(stack) + 1;
    const stackNumberDiv = document.createElement("div");

    stackNumberDiv.classList.add("stack-number");
    stackNumberDiv.textContent = stackNumber.toString();

    for (let disk = maxStackLength - 1; disk >= 0; disk--) {
      const diskDiv = document.createElement("div");
      diskDiv.classList.add("slot");
      diskDiv.id = `d${stackNumber}-${disk}`;
      stackDiv.appendChild(diskDiv);
    }

    stackDiv.appendChild(stackNumberDiv);
    grid!.appendChild(stackDiv);
  }
};

const createMoves = (moves: string[]) => {
  const movesDiv = document.querySelector("#moves");
  movesDiv!.innerHTML = "";

  for (const move of moves) {
    const moveDiv = document.createElement("div");
    moveDiv.classList.add("move");
    moveDiv.textContent = move;
    moveDiv.id = `m${moves.indexOf(move)}`;
    movesDiv!.appendChild(moveDiv);
  }
};

const updateItems = (stacks: string[][]) => {
  for (const stack of stacks) {
    const stackNumber = stacks.indexOf(stack) + 1;

    for (const item in stack) {
      const targetDiv = document.querySelector(
        `#d${stackNumber}-${item}`
      ) as HTMLDivElement;

      const contentElement = document.querySelector(
        `#s${stackNumber}-${item}`
      ) as HTMLDivElement;
      contentElement.style.top = `${targetDiv.offsetTop}px`;
      contentElement.style.left = `${targetDiv.offsetLeft}px`;
    }
  }
};

const addRowToGrid = () => {
  const max = Math.max(...stacks.map((s) => s.length));

  for (const stack of stacks) {
    const stackDiv = document.querySelector(
      `#stack-${stacks.indexOf(stack) + 1}`
    );
    const diskDiv = document.createElement("div");
    diskDiv.classList.add("slot");
    diskDiv.id = `d${stacks.indexOf(stack) + 1}-${max}`;
    // add element after start of stack
    stackDiv!.insertBefore(diskDiv, stackDiv!.firstChild);
  }
};

const handleMove = async (move: string) => {
  // remove all active classes
  document
    .querySelectorAll(".active")
    .forEach((e) => e.classList.remove("active"));

  document.getElementById(`m${moves.indexOf(move)}`)!.classList.add("active");
  const [howMany, from, to] = move.match(/\d+/g)!.map(Number);

  for (let i = 0; i < howMany; i++) {
    console.log(stacks[to - 1].length, maxStackLength);
    if (stacks[to - 1].length >= maxStackLength) {
      maxStackLength = stacks[to - 1].length;
      addRowToGrid();
      await wait(200);
      updateItems(stacks);
      await wait(500);
    }

    const stackItem = document.querySelector(
      `#s${from}-${stacks[from - 1].length - 1}`
    ) as HTMLDivElement;

    const targetDiv = document.querySelector(
      `#d${to}-${stacks[to - 1].length}`
    ) as HTMLDivElement;

    console.log(from, stacks[from - 1].length - 1, stackItem, targetDiv);
    stackItem.style.top = `${targetDiv.offsetTop}px`;
    stackItem.style.left = `${targetDiv.offsetLeft}px`;
    stackItem.id = `s${to}-${stacks[to - 1].length}`;

    await wait(500);

    stacks[to - 1].push(stacks[from - 1].pop()!);
  }
};

const createStackItems = (stacks: string[][]) => {
  //  place stack items on the grid with absolute positioning on disk divs
  const items = document.querySelector("#items");

  for (const stack of stacks) {
    const stackNumber = stacks.indexOf(stack) + 1;

    for (const item in stack) {
      const diskDiv = document.querySelector(
        `#d${stackNumber}-${item}`
      ) as HTMLDivElement;

      const contentElement = document.createElement("div");
      contentElement.classList.add("stack-item");
      contentElement.textContent = stack[item];
      contentElement.id = `s${stackNumber}-${item}`;

      contentElement.style.top = `${diskDiv!.offsetTop}px`;
      contentElement.style.left = `${diskDiv!.offsetLeft}px`;

      items!.appendChild(contentElement);
    }
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const showResult = (stacks: string[][]) => {
  const items = document.querySelector("#items");
  items?.classList.add("end");

  for (const stack of stacks) {
    const stackNumber = stacks.indexOf(stack) + 1;
    const lastItem = stack[stack.length - 1];

    const element = document.querySelector(
      `#s${stackNumber}-${stack.length - 1}`
    );
    element!.classList.add("result");
  }
};

const run = document.querySelector("button");
run!.addEventListener("click", async () => {
  maxStackLength = 0;
  parseInput(textarea?.value ? textarea.value : defaultValue);

  console.log(stacks);
  console.log(moves);

  document.getElementById("items")!.innerHTML = "";

  createGrid(stacks);
  createMoves(moves);
  await wait(500);

  createStackItems(stacks);
  await wait(500);

  for (const move of moves) {
    await handleMove(move);
    await wait(500);
  }

  document
    .querySelectorAll(".active")
    .forEach((e) => e.classList.remove("active"));

  showResult(stacks);
});
