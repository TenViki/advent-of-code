const PATH_TO_AOC = "C:\\Projekty\\advent-of-code\\2023";

import { exec } from "child_process";
import CliTable3 from "cli-table3";
import { readFileSync, readSync, readdirSync } from "fs";
import path from "path";

const execAsync = (command: string, stdin: string) =>
  new Promise<number>((resolve, reject) => {
    const child = exec(
      command,
      {
        env: {
          USE_STDIN: "TRUE",
        },
      },
      (err, stdout, stderr) => {
        if (err) reject(err);
        resolve(Date.now() - start);
      }
    );
    child.stdin?.write(stdin);
    child.stdin?.end();

    child.stdout?.on("data", (data: string) => {
      if (data?.includes("File loaded!")) start = Date.now();
    });

    let start = Date.now();
  });

const directories = readdirSync(path.join(PATH_TO_AOC, "dist")).filter(
  (x) => !isNaN(+x)
);
console.log("Found", directories.join(", "));

const runProcess = async (path: string, stdin: string) => {
  const runtime = await execAsync(`node ` + path, stdin);
  return runtime;
};

class StatusRunner {
  private intervalId;
  private currentDay = "";
  private spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

  constructor() {
    this.intervalId = setInterval(() => {
      const currentSpinner = this.spinner.shift();
      this.spinner.push(currentSpinner!);

      process.stdout.write(`\r${currentSpinner} Running ${this.currentDay}...`);
    }, 100);
  }

  changeDay(day: string) {
    this.currentDay = day;
  }

  stop() {
    clearInterval(this.intervalId);
    console.log("\rAll day have been finished!\n");
  }
}

const collectedData: {
  day: string;
  partOneTest: number;
  partOneInput: number;
  partTwoTest: number;
  partTwoInput: number;
}[] = [];

const main = async () => {
  const runner = new StatusRunner();

  for (const day of directories) {
    runner.changeDay(day);

    const b = path.join(PATH_TO_AOC, "dist", day, "b.js");
    const a = path.join(PATH_TO_AOC, "dist", day, "a.js");

    const pathToInput = path.join(PATH_TO_AOC, "src", day, "input.txt");
    const pathToTest = path.join(PATH_TO_AOC, "src", day, "test.txt");

    const input = readFileSync(pathToInput, "utf8");
    const test = readFileSync(pathToTest, "utf8");

    const partOneTest = await runProcess(a, test);
    const partOneInput = await runProcess(a, input);
    const partTwoTest = await runProcess(b, test);
    const partTwoInput = await runProcess(b, input);

    collectedData.push({
      day,
      partOneTest,
      partOneInput,
      partTwoTest,
      partTwoInput,
    });
  }

  runner.stop();

  // draw table
  const table = new CliTable3({
    head: [],
  });

  table.push(
    [
      {
        rowSpan: 2,
        style: { head: ["red"] },
        content: "Day",
      },
      {
        colSpan: 2,
        style: { head: ["red"] },
        content: "Part 1",
        hAlign: "center",
      },
      {
        colSpan: 2,
        style: { head: ["red"] },
        content: "Part 2",
        hAlign: "center",
      },
    ],
    [
      {
        style: { head: ["red"] },
        content: "Test",
      },
      {
        style: { head: ["red"] },
        content: "Input",
      },
      {
        style: { head: ["red"] },
        content: "Test",
      },
      {
        style: { head: ["red"] },
        content: "Input",
      },
    ]
  );
  for (const data of collectedData) {
    table.push([
      { content: data.day, hAlign: "right" },
      { content: data.partOneTest + "ms", hAlign: "right" },
      { content: data.partOneInput + "ms", hAlign: "right" },
      { content: data.partTwoTest + "ms", hAlign: "right" },
      { content: data.partTwoInput + "ms", hAlign: "right" },
    ]);
  }

  console.log(table.toString());
};

main();
