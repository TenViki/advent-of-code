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

const crt = document.getElementById("crt")!;
const instructions = document.getElementById("instructions")!;

const setInstructions = (instr: string[]) => {
  instructions.innerHTML = "";

  instr.forEach((instr, index) => {
    const div = document.createElement("div");
    div.innerText = instr;
    div.classList.add("instruction");
    div.id = `instruction-${index}`;
    instructions.appendChild(div);
  });
};

const setCRT = () => {
  crt.innerHTML = "";
  for (let y = 0; y < 6; y++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let x = 0; x < 40; x++) {
      const pixel = document.createElement("div");
      pixel.classList.add("pixel");
      pixel.id = `pixel-${x}-${y}`;
      row.appendChild(pixel);
    }

    crt.appendChild(row);
  }
};

const sprite = document.getElementById("sprite")!;
const spritePos = document.getElementById("sprite-pos-x")!;
const clockCycleEl = document.getElementById("clock-cycle")!;

const run = async () => {
  document.querySelectorAll(".pixel").forEach((p) => p.classList.remove("on"));
  document.querySelector("button").disabled = true;
  const instructions = (textarea!.value || defaultValue)
    .split("\n")
    .map((s) => s.trim());

  setInstructions(instructions);
  setCRT();

  const pixelWidth = document.getElementById("pixel-0-0")!.offsetWidth;

  sprite.style.width = pixelWidth * 3 + "px";

  let clockCycle = 0;
  let currentOperation: string = "";
  let currentOperationDuration: number = -1;
  let registerValue = 1;

  let i = 0;

  let instrElement;

  while (clockCycle < 240) {
    const crtRow = Math.floor(clockCycle / 40);
    const crtCol = clockCycle % 40;

    const currentPixel = document.getElementById(`pixel-${crtCol}-${crtRow}`)!;
    currentPixel.classList.add("active");

    if (Math.abs(registerValue - (clockCycle % 40)) <= 1)
      currentPixel.classList.add("on");

    if (
      currentOperation == "noop" ||
      (currentOperation.startsWith("addx") && currentOperationDuration == 1) ||
      !currentOperation
    ) {
      currentOperation = instructions[i];
      instrElement = document.getElementById(`instruction-${i}`);
      instrElement!.classList.add("current");

      i++;
      console.log("Current op", currentOperation);
      if (currentOperation.startsWith("addx")) currentOperationDuration = 0;
    } else {
      // current operation is addx but it hasnt finished yet
      currentOperationDuration += 1;

      const number = +currentOperation.split(" ")[1];
      registerValue += number;
    }

    clockCycle++;
    clockCycleEl.innerText = clockCycle + "";

    await wait(speed);
    sprite.style.left = (registerValue - 1) * pixelWidth + "px";
    spritePos.innerText = registerValue + "";
    await wait(speed);

    if (currentOperationDuration == 1) {
      instrElement.classList.remove("current");
      instrElement.classList.add("done");
    }
  }

  document.querySelector("button").disabled = false;
};

export {};
