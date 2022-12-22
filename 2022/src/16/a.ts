import { InputParser } from "../lib/files";

interface Valve {
  name: string;
  flowRate: number;
  leadsTo: string[];
}

const inputParser = new InputParser("in.txt");
const valves: { [key: string]: Valve } = {};

const distanceMap = new Map<string, number>();

while (inputParser.hasNext()) {
  const valveData = inputParser.next()!;
  const [currentValve, ...leadsTo] =
    valveData.match(/[A-Z]{2}/g)?.map((v) => v.trim()) ?? [];
  const valveValue = valveData.match(/\d+/)?.map(Number)[0] ?? 0;

  valves[currentValve] = {
    name: currentValve,
    flowRate: valveValue,
    leadsTo: leadsTo,
  };
}

const getDistances = () => {
  for (const valve of Object.values(valves).filter(
    (v) => v.flowRate > 0 || v.name === "AA"
  )) {
    const queue = [
      ...valve.leadsTo.map((v) => ({
        valve: v,
        distance: 1,
      })),
    ];

    let visited = new Map<string, number>();

    while (queue.length) {
      const { valve: currValve, distance } = queue.shift()!;
      if (visited.has(currValve)) continue;

      visited.set(currValve, distance);

      distanceMap.set(`${valve.name}-${currValve}`, distance);

      for (const nextValve of valves[currValve].leadsTo) {
        queue.push({
          valve: nextValve,
          distance: distance + 1,
        });
      }
    }
  }
};

getDistances();

type QueueItem = {
  valve: Valve;
  timeRemaining: number;
  openedValves: Valve[];
  flowScore: number;
};

const queue: QueueItem[] = [
  {
    valve: valves["AA"],
    timeRemaining: 30,
    openedValves: [],
    flowScore: 0,
  },
];

const done: QueueItem[] = [];

const relevantValves = Object.values(valves).filter(
  (valve) => valve.flowRate > 0
);

while (queue.length) {
  const { valve, timeRemaining, openedValves, flowScore } = queue.shift()!;

  for (const relevantValve of relevantValves) {
    if (openedValves.includes(relevantValve)) continue;

    const distanceToValve =
      distanceMap.get(`${valve.name}-${relevantValve.name}`) ?? 0;

    if (distanceToValve > timeRemaining) {
      done.push({
        valve,
        timeRemaining,
        openedValves,
        flowScore,
      });

      continue;
    }

    const newTimeRemaining = timeRemaining - distanceToValve - 1;
    const newFlowScore =
      flowScore +
      openedValves.reduce((acc, v) => {
        return acc + v.flowRate;
      }, 0) *
        (distanceToValve + 1);

    const newOpenedValves = [...openedValves, relevantValve];

    queue.push({
      flowScore: newFlowScore,
      openedValves: newOpenedValves,
      timeRemaining: newTimeRemaining,
      valve: relevantValve,
    });

    if (newOpenedValves.length == relevantValves.length) {
      done.push({
        flowScore: newFlowScore,
        openedValves: newOpenedValves,
        timeRemaining: newTimeRemaining,
        valve: relevantValve,
      });
    }
  }
}

const doneValues = done.map((v) => {
  const timeLeft = v.timeRemaining;
  const flowScore = v.flowScore;

  return (
    flowScore +
    timeLeft * v.openedValves.reduce((acc, v) => acc + v.flowRate, 0)
  );
});

let maxVal = 0;

for (const value of doneValues) {
  if (value > maxVal) maxVal = value;
}

console.log(
  "Max val:",
  doneValues.find((v) => v == maxVal)
);
