import { join } from "path";

const elements = document.querySelectorAll(
  ".day-select"
) as NodeListOf<HTMLButtonElement>;

const options = document.querySelectorAll(
  ".option-select"
) as NodeListOf<HTMLButtonElement>;

const span = document.getElementById("t-name");
const methodSelect = document.getElementById("method-select");

let selectedDay;

elements.forEach((e) => {
  const handleHover = () => {
    const day = e.getAttribute("x-attr-name");
    span.textContent = day;
  };

  e.addEventListener("mouseover", handleHover);
  e.addEventListener("focus", handleHover);
  e.addEventListener("click", () => {
    selectedDay = e.getAttribute("x-attr-data");
    methodSelect.style.display = "block";
    e.classList.add("selected");
    options[0].focus();
    elements.forEach((e) => (e.disabled = true));
  });
});

options.forEach((o) => {
  o.addEventListener("click", async () => {
    const url = o.getAttribute("x-attr-data").replace("{day}", selectedDay);
    document.getElementById("loading")!.style.display = "block";
    console.log(url);

    let str = "";

    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 50));
      str += "#";
      const fill = new Array(19 - i).fill(" ").join("");
      console.log(fill);

      document.getElementById("loading")!.textContent =
        "Loading [" + str + fill + "]";
    }

    window.location.href = url;
  });
});

elements[0].focus();
