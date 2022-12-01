import { InputParser } from "../lib/files";

const inputParser = new InputParser("input.txt");

const elves = [];
let i = 0;

while (inputParser.hasNext()) {
    const number = inputParser.nextNumber();
    if (!number) {
        i++;
    } else {
        if (!elves[i]) elves[i] = 0;
        elves[i] += number;
    }
}

console.log(Math.max(...elves));