import { InputParser } from "../lib/files";

const parser = new InputParser("input.txt");

const t_m = +parser.next()!.replaceAll(" ", "").match(/\d+/gm)!;

const x = +parser.next()!.replaceAll(" ", "").match(/\d+/gm)!;

let d = t_m ** 2 - 4 * x;

let t_1 = (t_m - Math.sqrt(d)) / 2;
let t_2 = (t_m + Math.sqrt(d)) / 2;

let t_min = Math.ceil(t_1);
let t_max = Math.floor(t_2);

if (t_min == t_1) t_min++;
if (t_max == t_2) t_max--;

let possibilites = t_max - t_min + 1;
console.log("Calculated for", t_m, x, "->", t_min, t_max);

console.log("Number of possibilities:", possibilites);
