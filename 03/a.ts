import { InputParser } from "../files";

const input = new InputParser("in.txt");
const data = input.getFullInput().split("\r\n");

let gamma = "";
let epsilon = "";

const bin2dec = (bin: string) => {
  return parseInt(bin, 2);
};

const getMostcommonBitAtColumnd = (col: number) => {
  let zeros = 0;
  let ones = 0;

  data.forEach((row) => {
    if (row[col] === "0") zeros++;
    else ones++;
  });

  if (zeros > ones) {
    gamma += "0";
    epsilon += "1";
  } else {
    gamma += "1";
    epsilon += "0";
  }
};

for (let i = 0; i < data[0].length; i++) {
  getMostcommonBitAtColumnd(i);
}

console.log(bin2dec(gamma) * bin2dec(epsilon));
