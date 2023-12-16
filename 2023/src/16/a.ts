import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");
const grid = parser.loadAsGrid();

console.log(grid.length, grid[0].length);

interface LightSpaceType {
  direction: number;
  x: number;
  y: number;
}

const offsetMap = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const mirrorOneDirectionMap: { [k: number]: number } = {
  // /
  0: 1,
  1: 0,
  2: 3,
  3: 2,
};

const mirrorTwoDirectionMap: { [k: number]: number } = {
  // \
  0: 3,
  3: 0,
  1: 2,
  2: 1,
};

const lightSpaces: LightSpaceType[] = [];
const queue: LightSpaceType[] = [
  {
    x: -1,
    y: 0,
    direction: 1,
  },
];

while (queue.length) {
  const curr = queue.shift()!;

  if (
    lightSpaces.find(
      (s) => s.x == curr.x && s.y == curr.y && s.direction == curr.direction
    )
  )
    continue;

  lightSpaces.push(curr);

  const nextCords = [
    curr.y + offsetMap[curr.direction][0],
    curr.x + offsetMap[curr.direction][1],
  ];

  if (nextCords[0] < 0 || nextCords[0] >= grid.length) continue;
  if (nextCords[1] < 0 || nextCords[1] >= grid[0].length) continue;

  const nextValue = grid[nextCords[0]][nextCords[1]];

  if (nextValue === "/") {
    queue.push({
      x: nextCords[1],
      y: nextCords[0],
      direction: mirrorOneDirectionMap[curr.direction],
    });
  } else if (nextValue === "\\") {
    queue.push({
      x: nextCords[1],
      y: nextCords[0],
      direction: mirrorTwoDirectionMap[curr.direction],
    });
  } else if (nextValue === "-" && curr.direction % 2 == 0) {
    queue.push({
      x: nextCords[1],
      y: nextCords[0],
      direction: 1,
    });
    queue.push({
      x: nextCords[1],
      y: nextCords[0],
      direction: 3,
    });
  } else if (nextValue === "|" && curr.direction % 2 == 1) {
    queue.push({
      x: nextCords[1],
      y: nextCords[0],
      direction: 0,
    });
    queue.push({
      x: nextCords[1],
      y: nextCords[0],
      direction: 2,
    });
  } else
    queue.push({
      x: nextCords[1],
      y: nextCords[0],
      direction: curr.direction,
    });
}

// calculate all the unique cords
const cords = new Set<string>();
for (const lightSpace of lightSpaces) {
  cords.add(`${lightSpace.y};${lightSpace.x}`);
}

console.log(cords.size - 1);
