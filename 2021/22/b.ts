import { InputParser } from "../files";

const input = new InputParser("in.txt");
// ["off", [0, 0, 0], [52, 12, 30]]

interface Box {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z1: number;
  z2: number;
}

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

    return [state as "on" | "off", [x[0], y[0], z[0]], [x[1], y[1], z[1]]];
  });

const lineOverlap = (x1: number, x2: number, x1_: number, x2_: number) => [Math.max(x1, x1_), Math.min(x2, x2_)];
const volume = (b: Box) => (b.x2 - b.x1 + 1) * (b.y2 - b.y1 + 1) * (b.z2 - b.z1 + 1);
const newBox = (x1: number, x2: number, y1: number, y2: number, z1: number, z2: number): Box => ({
  x1,
  x2,
  y1,
  y2,
  z1,
  z2,
});

const overlap = (box: Box, boxes: Box[]): number => {
  return boxes
    .map((b) => {
      const [minX, maxX] = lineOverlap(box.x1, box.x2, b.x1, b.x2);
      const [minY, maxY] = lineOverlap(box.y1, box.y2, b.y1, b.y2);
      const [minZ, maxZ] = lineOverlap(box.z1, box.z2, b.z1, b.z2);

      if (maxX - minX >= 0 && maxY - minY >= 0 && maxZ - minZ >= 0) {
        const temp_box = newBox(minX, maxX, minY, maxY, minZ, maxZ);
        return volume(temp_box) - overlap(temp_box, boxes.slice(1 + boxes.indexOf(b)));
      } else {
        return 0;
      }
    })
    .reduce((acc, curr) => acc + curr, 0);
};

let totalOn = 0;
const boxes: Box[] = [];
rows.reverse();
rows.forEach((row) => {
  const box = newBox(row[1][0], row[2][0], row[1][1], row[2][1], row[1][2], row[2][2]);
  if (row[0] === "on") totalOn += volume(box) - overlap(box, boxes);
  boxes.push(box);
});

console.log(totalOn);
