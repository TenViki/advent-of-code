const nodes = [];
const links = [];

const width = window.innerWidth;
const height = window.innerHeight;

const run = async () => {
  const fetched = await fetch("./data.txt");
  const data = await (await fetched.text()).split("\r\n");

  const generatedX = [];
  const generatedY = [];

  data.forEach((line) => {
    const [nodeA, nodeB] = line.split("-");
    links.push(line);

    const nodeAIndex = nodes.findIndex((n) => n.id === nodeA);
    const nodeBIndex = nodes.findIndex((n) => n.id === nodeB);

    if (nodeAIndex === -1) {
      nodes.push({
        id: nodeA,
        links: [nodeB],
      });
    }
    if (nodeBIndex === -1) {
      nodes.push({
        id: nodeB,
        links: [nodeA],
      });
    }

    if (nodeAIndex !== -1) {
      nodes[nodeAIndex].links.push(nodeB);
    }

    if (nodeBIndex !== -1) {
      nodes[nodeBIndex].links.push(nodeA);
    }
  });

  let html = "";
  const parent = document.getElementById("current");

  nodes.forEach(async (node) => {
    const top = Math.random() * ((height / 3) * 2);
    const left = Math.random() * ((width / 3) * 2);

    generatedX.push(left);
    generatedY.push(top);

    const tag = document.createElement("div");
    tag.textContent = node.id;
    tag.style.top = `${top}px`;
    tag.style.left = `${left}px`;
    tag.classList.add("node", node.id);

    node.element = tag;

    parent.insertAdjacentElement("afterend", tag);
  });

  links.forEach((link) => {
    const [nodeA, nodeB] = link.split("-");
    const a = nodes.find((n) => n.id === nodeA).element;
    const b = nodes.find((n) => n.id === nodeB).element;

    const width = Math.abs(a.offsetLeft - b.offsetLeft);
    const height = Math.abs(a.offsetTop - b.offsetTop);

    const top =
      a.offsetTop < b.offsetTop
        ? a.offsetTop + a.offsetHeight
        : b.offsetTop + b.offsetHeight;

    const left = a.offsetLeft < b.offsetLeft ? a.offsetLeft : b.offsetLeft;

    const length = Math.sqrt(width * width + height * height);

    const degree = (Math.atan(height / width) * 180) / Math.PI;

    let toRotate = 0;

    if (a.offsetLeft < b.offsetLeft) {
      if (a.offsetTop < b.offsetTop) {
        toRotate = degree;
      } else {
        toRotate = 90 + (90 - degree);
      }
    } else {
      if (a.offsetTop < b.offsetTop) {
        toRotate = 90 + (90 - degree);
      } else {
        toRotate = degree;
      }
    }

    const tag = document.createElement("div");
    tag.style.top = `${top}px`;
    tag.style.left = `${left}px`;
    tag.style.width = `${width}px`;
    tag.style.height = `${height}px`;

    const line = document.createElement("div");
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${toRotate}deg)`;
    line.classList.add("line", `${nodeA}-${nodeB}`, `${nodeB}-${nodeA}`);

    tag.appendChild(line);

    // tag.textContent = link;s
    // Random background color
    tag.classList.add("link");

    parent.insertAdjacentElement("afterend", tag);
  });

  document.getElementById("current").innerHTML = html;
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const markPaths = async (path) => {
  for (let i = 0; i < path.length - 2; i++) {
    document
      .querySelector(`.${path[i]}-${path[i + 1]}`)
      .classList.add("active");
  }
  document
    .querySelector(`.${path[path.length - 2]}-${path[path.length - 1]}`)
    .classList.add("current");
};

const clearCurrent = () => {
  const elements = document.querySelectorAll(".current");
  console.log(elements);
  elements.forEach((el) => {
    el.classList.remove("current");
  });
};

const markSuccess = (path) => {
  console.log("Marging", path);
  for (let i = 0; i < path.length - 1; i++) {
    document
      .querySelector(`.${path[i]}-${path[i + 1]}`)
      .classList.add("success");
  }
};

const clearPath = () => {
  const elements = document.querySelectorAll(".active,.success");
  elements.forEach((el) => {
    el.classList.remove("active", "success", "current");
  });
};

const main = async () => {
  document.getElementById("start").remove();
  const paths = [];
  const completes = [];
  paths.push(["start"]);

  while (paths.length) {
    const p0 = paths.shift();
    for (let s of nodes.find((n) => n.id === p0[p0.length - 1]).links) {
      if (s.toLowerCase() === s && p0.includes(s)) continue;

      const p1 = [...p0, s];

      if (s === "end") {
        completes.push(p1);
        document.getElementById("c-path").textContent = p1.join("-");
        document.getElementById("c-paths").textContent = completes.length;
        document
          .getElementById("possible")
          .insertAdjacentHTML(
            "afterbegin",
            `<div class="number">${p1.join("-")}</div>`
          );
        markPaths(p1);
        await wait(10);
        markSuccess(p1);
        await wait(10);
      } else {
        paths.push(p1);
        document.getElementById("c-path").textContent = p1.join("-");
        markPaths(p1);
      }

      await wait(10);
      clearCurrent();
    }

    clearPath();
  }

  console.log(completes);
};

run();
