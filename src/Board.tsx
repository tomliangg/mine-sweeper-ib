import { FC, MouseEvent } from "react";
import { cx } from "@emotion/css";
import { Cell, POUND, MINE, FLAG, traverse, isGameFinished } from "./utils";
import { GameStatus } from "./constants";

interface BoardProps {
  board: Cell[][];
  setBoard: (newBoard: Cell[][]) => void;
  status: string;
  setStatus: (newStatus: GameStatus) => void;
  flags: number;
  setFlags: (flagCounts: number) => void;
  cheatMode: boolean;
}

export const Board: FC<BoardProps> = ({
  board,
  setBoard,
  status,
  setStatus,
  flags,
  setFlags,
  cheatMode,
}) => {
  const shouldDisplayCell = (i: number, j: number) =>
    String(board[i][j]).includes(POUND) || String(board[i][j]).includes(FLAG);

  const renderCell = (i: number, j: number) => {
    const val = String(board[i][j]).replace(POUND, "").replace("0", "");
    if (status === GameStatus.Won && val === MINE) {
      return "🚩";
    }

    if ((cheatMode || status === GameStatus.Lost) && val === MINE) {
      return "💣";
    }

    if (!shouldDisplayCell(i, j)) {
      return "";
    }

    if (val === MINE) {
      return "💣";
    }

    if (val.includes(FLAG)) {
      return "🚩";
    }

    return val;
  };
  const handleCellClick = (i: number, j: number) => {
    if (status !== GameStatus.Playing) {
      return;
    }

    const val = String(board[i][j]);
    if (val.includes(FLAG)) {
      return;
    }

    const copyBoard = structuredClone(board);
    if (val === MINE) {
      copyBoard[i][j] = `${POUND}${MINE}`;
      setStatus(GameStatus.Lost);
      setBoard(copyBoard);
      return;
    }

    traverse(copyBoard, i, j);
    setBoard(copyBoard);
    if (isGameFinished(copyBoard)) {
      setStatus(GameStatus.Won);
    }
  };

  const handleRightClick = (e: MouseEvent, i: number, j: number) => {
    e.preventDefault();
    if (status !== GameStatus.Playing) {
      return;
    }
    const val = String(board[i][j]);
    if (val.includes(POUND)) {
      return;
    }

    const copyBoard = structuredClone(board);

    // remove a flag
    if (val.includes(FLAG)) {
      copyBoard[i][j] = val.replace(FLAG, "");
      setBoard(copyBoard);
      setFlags(flags + 1);
      return;
    }

    // add a flag
    if (flags > 0) {
      copyBoard[i][j] = val + FLAG;
      setBoard(copyBoard);
      setFlags(flags - 1);
    }
  };

  return (
    <div className="board">
      {board.map((rowData, i) => (
        <div key={`row-${i}`} className="row">
          {rowData.map((_, j) => (
            <button
              key={`cell-${i}-${j}`}
              className={cx(
                "cell",
                shouldDisplayCell(i, j) ? "revealed" : "unvisited",
                board[i][j] === `${POUND}${MINE}` &&
                  status !== GameStatus.Playing
                  ? "activeMine"
                  : "regularCell",
                status
              )}
              disabled={status !== GameStatus.Playing}
              onClick={() => handleCellClick(i, j)}
              onContextMenu={(e) => handleRightClick(e, i, j)}
            >
              {renderCell(i, j)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
