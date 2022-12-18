import * as fs from "fs";

export class InputParser {
  private lines: string[];
  private linesRead: number = 0;

  constructor(filename: string, private outputname?: string) {
    console.log(`Loading file ${filename} as input`);
    const file = fs.readFileSync(filename, "utf8");
    console.log(`File loaded!`);
    this.lines = file.split("\n").filter((line) => line);

    if (outputname) {
      console.log(`Output file: ${outputname}`);
      // Clear the file
      fs.writeFileSync(outputname, "", { flag: "w" });
    }
  }

  public appendOutput(output: string) {
    if (this.outputname) {
      fs.appendFileSync(this.outputname, output + "\n");
    }
  }

  public next(moveSelector = true): string | null {
    if (this.linesRead >= this.lines.length) {
      return null;
    }
    const line = this.lines[this.linesRead];

    if (moveSelector) this.linesRead++;

    return line.replace("\r", "");
  }

  public nextUntilEmptyLine(): string[] | null {
    const lines: string[] = [];
    let line = this.next();
    while (line !== null && line !== "") {
      lines.push(line);
      line = this.next();
    }
    return lines;
  }

  public nextNumber(): number | null {
    const line = this.next();
    if (line === null) {
      return null;
    }
    return parseInt(line);
  }

  public nextNumberArray(spearator = " "): number[] | null {
    const line = this.next();
    if (line === null) {
      return null;
    }
    return line.trim().split(spearator).map(Number);
  }

  public hasNext(): boolean {
    return this.linesRead < this.lines.length;
  }

  public getFullInput(): string {
    return this.lines.join("\n");
  }
}
