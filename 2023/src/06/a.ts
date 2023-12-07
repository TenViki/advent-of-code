import { InputParser } from "../lib/files";

const parser = new InputParser("test.txt");

const times = parser
  .next()!
  .match(/\d+/gm)!
  .map((x) => parseInt(x));

const distances = parser
  .next()!
  .match(/\d+/gm)!
  .map((x) => parseInt(x));

let sum = 1;

for (let i = 0; i < times.length; i++) {
  const t_m = times[i];
  const x = distances[i];

  let d = t_m ** 2 - 4 * x;

  let t_1 = (t_m - Math.sqrt(d)) / 2;
  let t_2 = (t_m + Math.sqrt(d)) / 2;

  let t_min = Math.ceil(t_1);
  let t_max = Math.floor(t_2);

  if (t_min == t_1) t_min++;
  if (t_max == t_2) t_max--;

  let possibilites = t_max - t_min + 1;
  console.log("Calculated for", t_m, x, "->", t_min, t_max, ":", possibilites);

  sum *= possibilites;
}

console.log("Final score:", sum);
