import { InputParser } from "../files";

const input = new InputParser("in.txt");
let data = input.getFullInput().split("\r\n");

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

  return [zeros, ones];
};

const deleteDataWithBitOnPosition = (bit: string, position: number) => {
  const to_remove: number[] = [];
  data.forEach((row, index) => {
    if (row[position] === bit) {
      to_remove.push(index);
    }
  });

  to_remove.sort((a, b) => b - a);

  to_remove.forEach((index) => {
    if (data.length === 1) return;
    data.splice(index, 1);
  });
};

const findOxygenRating = () => {
  const len = data[0].length;
  for (let i = 0; i < len; i++) {
    const [zeroes, ones] = getMostcommonBitAtColumnd(i);

    if (zeroes > ones) {
      deleteDataWithBitOnPosition("1", i);
    }

    if (ones > zeroes || zeroes === ones) {
      deleteDataWithBitOnPosition("0", i);
    }
  }
};

const findLifeSupportRating = () => {
  const len = data[0].length;
  for (let i = 0; i < len; i++) {
    const [zeroes, ones] = getMostcommonBitAtColumnd(i);

    if (zeroes < ones || zeroes === ones) {
      deleteDataWithBitOnPosition("1", i);
    }

    if (ones < zeroes) {
      deleteDataWithBitOnPosition("0", i);
    }
  }
};

findOxygenRating();
let oxygen_rating = data[0];

data = input.getFullInput().split("\r\n");

findLifeSupportRating();
let life_support_rating = data[0];

console.log(bin2dec(oxygen_rating) * bin2dec(life_support_rating));
