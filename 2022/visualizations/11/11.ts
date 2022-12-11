interface Monkey {
  id: number;
  items: {
    value: number;
    id: number;
  }[];
  operation: {
    operation: string;
    value1: string;
    value2: string;
  };
  test: {
    divisbleBy: number;
    ifYes: number;
    ifNo: number;
  };
  activity: number;
}

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

const monkeysEl = document.getElementById("monkeys");
const items = document.getElementById("items");

let itemsCounter = 0;

const placeMonkys = (monkeys: Monkey[]) => {
  let monkeyLength = monkeys.length;
  const fromCenter =
    Math.min(monkeysEl.offsetWidth, monkeysEl.offsetHeight) / 2 - 100;

  for (const i in monkeys) {
    const monkey = monkeys[i];
    const angle = (360 / monkeyLength) * Number(i);
    const x = fromCenter * Math.sin((angle * Math.PI) / 180);
    const y = fromCenter * -Math.cos((angle * Math.PI) / 180) - 100 + 16;

    const monkeyEl = document.createElement("div");
    monkeyEl.classList.add("monkey");
    monkeyEl.style.left = `calc(50% + ${x}px)`;
    monkeyEl.style.top = `calc(50% + ${y}px)`;
    monkeyEl.id = `monkey-${monkey.id}`;
    monkeyEl.innerHTML = `
    <div class="monkey-id" id="monkey-${monkey.id}-id">Monkey ${monkey.id}</div>
    <div class="monkey-op">new = ${monkey.operation.value1} ${
      monkey.operation.operation
    } ${monkey.operation.value2}</div>
    <div class="monkey-test">if % ${monkey.test.divisbleBy} ${
      monkey.test.ifYes
    } <br>else ${monkey.test.ifNo}</div>
    <div class="monkey-activity" id="monkey-${monkey.id}-activity">Activity: ${
      monkey.activity
    }</div>
    <div class="monkey-items" id="monkey-${monkey.id}-item-slots">
      ${monkey.items
        .map(
          (v) => `<div class="monkey-item-slot" id="item-slot-${v.id}"></div>`
        )
        .join("")}
    </div>
    `;
    monkeysEl!.appendChild(monkeyEl);
  }
};

const placeItems = (monkeys: Monkey[]) => {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      const itemEl = document.createElement("div");
      itemEl.classList.add("item");
      itemEl.id = `item-${item.id}`;
      itemEl.innerHTML = `<div class="item-value">${item.value}</div>`;

      const boundRect = document
        .getElementById(`item-slot-${item.id}`)
        .getBoundingClientRect();
      console.log(item.id, boundRect);
      itemEl.style.left = `${boundRect.left}px`;
      itemEl.style.top = `${boundRect.top}px`;

      items!.appendChild(itemEl);
    }
  }
};

const updateItems = (monkeys: Monkey[]) => {
  // first, update slots
  for (const monkey in monkeys) {
    const itemSlots = document.getElementById(
      "monkey-" + monkey + "-item-slots"
    );
    itemSlots!.innerHTML = "";
    const monkeyItems = monkeys[monkey].items;
    for (const item in monkeyItems) {
      const itemSlot = document.createElement("div");
      itemSlot.classList.add("monkey-item-slot");
      itemSlot.id = "item-slot-" + monkeyItems[item].id;
      itemSlot.style.width =
        monkeyItems[item].value.toString().length * 10 + "px";
      itemSlots!.appendChild(itemSlot);
    }
  }

  // then, update items
  for (const monkey in monkeys) {
    const monkeyItems = monkeys[monkey].items;
    for (const item in monkeyItems) {
      const itemEl = document.getElementById("item-" + monkeyItems[item].id);
      const boundRect = document
        .getElementById("item-slot-" + monkeyItems[item].id)
        .getBoundingClientRect();
      itemEl!.style.left = `${boundRect.left}px`;
      itemEl!.style.top = `${boundRect.top}px`;
    }
  }
};

const run = async () => {
  document.querySelector("button")!.disabled = true;

  const monkeys: Monkey[] = [];
  const monkeysRaw = (textarea.value || defaultValue)
    .replaceAll("\r", "")
    .split("\n\n");

  for (const monkeyData of monkeysRaw) {
    const monkeyDataArr = monkeyData.split("\n");
    const startingItems = monkeyDataArr[1].match(/\d+/g)!.map(Number);
    const operation = monkeyDataArr[2]
      .match(/(\d+|old)\ .\ (\d+|old)/)![0]
      .split(" ");

    const test = monkeyDataArr[3].match(/\d+/g)!;
    const ifYes = monkeyDataArr[4].match(/\d+/g)!;
    const ifNo = monkeyDataArr[5].match(/\d+/g)!;

    const monkeyItems = startingItems.map((v) => ({
      value: v,
      id: ++itemsCounter,
    }));

    monkeys.push({
      id: +monkeyDataArr[0].match(/\d+/g)!,
      items: monkeyItems,
      operation: {
        operation: operation[1],
        value1: operation[0],
        value2: operation[2],
      },
      test: {
        divisbleBy: Number(test[0]),
        ifYes: Number(ifYes[0]),
        ifNo: Number(ifNo[0]),
      },
      activity: 0,
    });
  }

  placeMonkys(monkeys);
  placeItems(monkeys);

  for (let i = 0; i < 20; i++) {
    document.querySelector("#info span").textContent = `${i + 1}`;
    for (const monkey of monkeys) {
      document.getElementById(
        "arrow"
      ).style.transform = `translate(-50%, -50%) rotate(${
        (360 / monkeys.length) * monkey.id + i * 360
      }deg)`;

      document.getElementById(
        "arrow-1"
      ).style.transform = `translate(-50%, -50%) rotate(${
        (360 / monkeys.length) * monkey.test.ifYes
      }deg)`;

      document.getElementById(
        "arrow-2"
      ).style.transform = `translate(-50%, -50%) rotate(${
        (360 / monkeys.length) * monkey.test.ifNo
      }deg)`;

      document
        .getElementById("monkey-" + monkey.id + "-id")!
        .classList.add("active");

      while (monkey.items.length) {
        await wait(speed * 2);
        const item = monkey.items.shift()!;

        let newValue = 0;
        let value1 =
          monkey.operation.value1 === "old"
            ? item.value
            : Number(monkey.operation.value1);
        let value2 =
          monkey.operation.value2 === "old"
            ? item.value
            : Number(monkey.operation.value2);

        switch (monkey.operation.operation) {
          case "+":
            newValue = value1 + value2;
            break;
          case "*":
            newValue = value1 * value2;
        }

        newValue = Math.floor(newValue / 3);

        if (newValue % monkey.test.divisbleBy == 0)
          monkeys[monkey.test.ifYes].items.push({
            value: newValue,
            id: item.id,
          });
        else
          monkeys[monkey.test.ifNo].items.push({
            value: newValue,
            id: item.id,
          });

        monkey.activity++;

        // update item value
        document.getElementById(
          `item-${item.id}`
        )!.innerHTML = `<div class="item-value">${newValue}</div>`;

        document.getElementById(
          `monkey-${monkey.id}-activity`
        )!.innerHTML = `Activity: ${monkey.activity}`;

        updateItems(monkeys);
      }
      await wait(speed * 4);
      document
        .getElementById("monkey-" + monkey.id + "-id")!
        .classList.remove("active");
    }
  }

  document.querySelector("button")!.disabled = false;
};

export {};
