import { InputParser } from "../files";

const input = new InputParser("in.txt");
const boards = input
  .getFullInput()
  .replaceAll("  ", " ")
  .split("\r\n\r\n")
  .map((x) => x.split("\r\n").map((y) => y.split(" ").filter((z) => z !== "")));

const numbers = boards.shift()![0][0].split(",");

const checkNumbers = (num: string) => {
  boards.forEach((board, bs) => {
    board.forEach((row, i) => {
      row.forEach((number, k) => {
        if (number === num) {
          boards[bs][i][k] = "x";
        }
      });
    });
  });
};

const checkForWin = (board: string[][]) => {
  let win = false;

  board.forEach((row, i) => {
    if (row.every((x) => x === "x")) {
      win = true;
    }
  });

  for (let i = 0; i < board[0].length; i++) {
    let col = [];
    for (let row of board) {
      col.push(row[i]);
    }
    if (col.every((x) => x === "x")) {
      win = true;
    }
  }

  return win;
};

const getSum = (board: string[][]) => {
  let sum = 0;
  board.forEach((row) => {
    row.forEach((num) => {
      if (num !== "x") sum += parseInt(num, 10);
    });
  });
  return sum;
};

let rounds = 0;
for (let number of numbers) {
  rounds++;
  checkNumbers(number);

  let won = false;

  for (let board of boards) {
    if (checkForWin(board)) {
      const sum = getSum(board);
      console.log(sum * +number);
      won = true;
    }
  }

  if (won) break;
}


const secondsToTime = (s: number) => {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s - hours * 3600) / 60);
  const seconds = s - hours * 3600 - minutes * 60;

  return `${hours}:${minutes}:${seconds}`;
}