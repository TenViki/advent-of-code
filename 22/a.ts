import { InputParser } from "../files";

const input = new InputParser("in.txt");
// ["off", [0, 0, 0], [52, 12, 30]]

const rows: ["on" | "off", [number, number, number], [number, number, number]][] = input
  .getFullInput()
  .replaceAll("\r", "")
  .split("\n")
  .map((row) => {
    const [state, xVals, yValy, zVals] = row
      .replaceAll(",", " ")
      .replaceAll("x", "")
      .replaceAll("y", "")
      .replaceAll("z", "")
      .replaceAll("=", "")
      .split(" ");
    const x = xVals.split("..").map(Number);
    const y = yValy.split("..").map(Number);
    const z = zVals.split("..").map(Number);

    return [state as "on" | "off", [x[0] + 50, y[0] + 50, z[0] + 50], [x[1] + 50, y[1] + 50, z[1] + 50]];
  });

const array: number[][][] = [];
for (let x = 0; x < 101; x++) {
  array[x] = [];
  for (let y = 0; y < 101; y++) {
    array[x][y] = [];
    for (let z = 0; z < 101; z++) {
      array[x][y][z] = 0;
    }
  }
}

rows.forEach(([state, [x1, y1, z1], [x2, y2, z2]]) => {
  if (x1 < 0 || x2 > 100 || y1 < 0 || y2 > 100 || z1 < 0 || z2 > 100) return;
  for (let i = x1; i <= x2; i++) {
    for (let j = y1; j <= y2; j++) {
      for (let k = z1; k <= z2; k++) {
        array[i][j][k] = state === "on" ? 1 : 0;
      }
    }
  }
});

const count = array.reduce((acc, row) => {
  return (
    acc +
    row.reduce((acc2, row2) => {
      return (
        acc2 +
        row2.reduce((acc3, row3) => {
          return acc3 + row3;
        }, 0)
      );
    }, 0)
  );
}, 0);

console.log(count);
