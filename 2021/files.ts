import fs from "fs";

export class InputParser {
  private lines: string[];
  private linesRead: number = 0;

  constructor(filename: string) {
    console.log(`Loading file ${filename} as input`);
    const file = fs.readFileSync(filename, "utf8");
    console.log(`File loaded!`);
    this.lines = file.split("\n").filter((line) => line);
  }

  public next(): string | null {
    if (this.linesRead >= this.lines.length) {
      return null;
    }
    const line = this.lines[this.linesRead];
    this.linesRead++;
    return line.replace("\r", "");
  }

  public hasNext(): boolean {
    return this.linesRead < this.lines.length;
  }

  public getFullInput(): string {
    return this.lines.join("\n");
  }
}
