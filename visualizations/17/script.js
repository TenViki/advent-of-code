const load = () => {
  const string = document.getElementById("input").value;
  const data = string
    .replaceAll("..", ",")
    .replaceAll("target area: x=", "")
    .replaceAll(" ", "")
    .replaceAll("y=", "")
    .split(",")
    .map(Number);
};

const main = async () => {};
