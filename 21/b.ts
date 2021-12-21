import { InputParser } from "../files";

const input = new InputParser("in.txt");
const data = input
  .getFullInput()
  .replaceAll("\r", "")
  .split("\n")
  .map((x) => x.substring(x.length - 1))
  .map(Number);

let states: { [string: string]: number } = {};

for (let positionA = 1; positionA <= 10; positionA++) {
  for (let pointsA = 0; pointsA <= 21; pointsA++) {
    for (let positionB = 1; positionB <= 10; positionB++) {
      for (let pointsB = 0; pointsB <= 21; pointsB++) {
        const key = `${positionA}-${pointsA}-${positionB}-${pointsB}`;
        states[key] = 0;
      }
    }
  }
}

states[`${data[0]}-0-${data[1]}-0`] = 1;

for (let i = 0; i < 10; i++) {
  const newStates: { [string: string]: number } = {};

  for (const key in states) {
    const state = states[key];
    if (state === 0) continue;

    const [positionA, pointsA, positionB, pointsB] = key.split("-").map(Number);

    if (pointsA === 21 || pointsB === 21) {
      if (newStates[key]) newStates[key] += state;
      else newStates[key] = state;
      continue;
    }

    if (pointsA > 21 || pointsB > 21) console.log("The heck?");

    for (let outcomeA = 1; outcomeA <= 3; outcomeA++) {
      for (let outcomeB = 1; outcomeB <= 3; outcomeB++) {
        for (let outcomeC = 1; outcomeC <= 3; outcomeC++) {
          let newPositionA = (positionA + outcomeA + outcomeB + outcomeC) % 10;
          if (newPositionA === 0) newPositionA = 10;

          let newPointsA = pointsA + newPositionA;
          if (newPointsA >= 21) {
            newPointsA = 21;
            const k = `${newPositionA}-${newPointsA}-${positionB}-${pointsB}`;
            if (newStates[k]) {
              newStates[k] += state;
            } else {
              newStates[k] = state;
            }
            continue;
          }

          for (let outcomeD = 1; outcomeD <= 3; outcomeD++) {
            for (let outcomeE = 1; outcomeE <= 3; outcomeE++) {
              for (let outcomeF = 1; outcomeF <= 3; outcomeF++) {
                let newPositionB = (positionB + outcomeD + outcomeE + outcomeF) % 10;
                if (newPositionB === 0) newPositionB = 10;

                let newPointsB = pointsB + newPositionB;
                if (newPointsB > 21) newPointsB = 21;

                const k = `${newPositionA}-${newPointsA}-${newPositionB}-${newPointsB}`;

                if (newStates[k]) {
                  newStates[k] += state;
                } else {
                  newStates[k] = state;
                }
              }
            }
          }
        }
      }
    }
  }

  states = newStates;
  console.log("Iteration", i);
}

// console.log(states);
// console.log(Object.values(states).reduce((a, b) => a + b));

let playerA = 0;
let playerB = 0;

for (const key in states) {
  const value = states[key];
  const [positionA, pointsA, positionB, pointsB] = key.split("-").map(Number);

  if (pointsA === 21) playerA += value;
  else if (pointsB === 21) playerB += value;
}

console.log(playerA, playerB);
