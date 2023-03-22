export type Cell = number | string;
export const MINE = "m";
export const POUND = "#"; // if a cell has # sign, the cell is visible in UI
export const FLAG = "f";
/**
 * each cell has up to 8 adjacent cells
 * cell value (type: string):
 * 0 - no mine in the adjacent cells
 * 1 - 1 mine in the adjacent cells
 * 2 - 2 mines in the adjacent cells
 * 3 - 3 mines in the adjacent cells
 * m - mine
 */
export const generateMineSweeperBoard = (
  boardSize: [number, number],
  mineLocations: Array<[number, number]>
) => {
  const totalRows = boardSize[0];
  const totalCols = boardSize[1];

  const board = Array<number>(totalRows)
    .fill(0)
    .map(() => Array<Cell>(totalCols).fill(0));

  mineLocations.forEach((loc) => {
    const [row, col] = loc;
    board[row][col] = MINE;
  });

  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // BFS
  const countMinesForCell = (i: number, j: number) => {
    let mines = 0;
    dirs.forEach((dir) => {
      const neighborI = i + dir[0];
      const neighborJ = j + dir[1];
      if (board[neighborI] && board[neighborI][neighborJ] === MINE) {
        mines++;
      }
    });
    return mines;
  };

  for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < totalCols; j++) {
      if (board[i][j] === 0) {
        board[i][j] = countMinesForCell(i, j);
      }
    }
  }

  return board;
};

// DFS
export const traverse = (board: Cell[][], i: number, j: number) => {
  const totalRows = board.length;
  const totalCols = board[0].length;
  if (i < 0 || i >= totalRows || j < 0 || j >= totalCols) {
    return;
  }

  const cellVal = board[i][j];
  if (cellVal === 0) {
    board[i][j] = POUND;
    traverse(board, i - 1, j); // up
    traverse(board, i + 1, j); // down
    traverse(board, i, j - 1); // left
    traverse(board, i, j + 1); // right
  }

  if (cellVal > 0) {
    board[i][j] = `${POUND}${cellVal}`; // add "#" to reveal the cell for UI
    return;
  }
};

export const generateMineLocations = (
  boardSize: [number, number],
  mineCounts: number
) => {
  const totalRows = boardSize[0];
  const totalCols = boardSize[1];
  if (mineCounts >= totalRows * totalCols) {
    throw Error("too many mines for the board");
  }

  const serialize = (location: [number, number]) =>
    String(location[0]) + "-" + String(location[1]);
  const deserialize = (s: string) =>
    s.split("-").map(Number) as [number, number];

  const mines = new Set<string>();
  while (mines.size < mineCounts) {
    const i = Math.floor(Math.random() * totalRows);
    const j = Math.floor(Math.random() * totalCols);
    const mineLocation: [number, number] = [i, j];
    mines.add(serialize(mineLocation));
  }

  return [...mines].map(deserialize);
};

export const isGameFinished = (board: Cell[][]) => {
  const totalRows = board.length;
  const totalCols = board[0].length;
  const total = totalRows * totalCols;
  let visitedCounts = 0;
  let mineCounts = 0;

  for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < totalCols; j++) {
      const val = String(board[i][j]);
      if (val.includes(POUND)) {
        visitedCounts++;
      }
      if (val.includes(MINE)) {
        mineCounts++;
      }
    }
  }
  return visitedCounts >= total - mineCounts;
};

export const clamp = (input: number, lower: number, upper: number) =>
  Math.min(Math.max(input, lower), upper);
