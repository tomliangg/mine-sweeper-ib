import { describe, it, expect } from "vitest";
import { useState } from "react";
import { Board } from "./Board";
import { generateMineSweeperBoard } from "./utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameStatus } from "./constants";

const boardSize: [number, number] = [3, 3];
const mineLocations: Array<[number, number]> = [
  [0, 0],
  [0, 1],
];

const testBoard = generateMineSweeperBoard(boardSize, mineLocations);

const TestComponent = ({ cheatMode = false }) => {
  const [board, setBoard] = useState(testBoard);

  const [status, setStatus] = useState(GameStatus.Playing);
  const [flags, setFlags] = useState(2);

  return (
    <Board
      board={board}
      setBoard={setBoard}
      status={status}
      setStatus={setStatus}
      flags={flags}
      setFlags={setFlags}
      cheatMode={cheatMode}
    />
  );
};

describe("Board", () => {
  it("should render the board correctly", () => {
    render(<TestComponent />);
    expect(screen.getAllByRole("button")).toHaveLength(
      boardSize[0] * boardSize[1]
    );
  });

  it("should reveal the cell correctly after mouse left click on a safe cell which has mines in its adjacent cells", async () => {
    render(<TestComponent />);
    expect(screen.getAllByRole("button")).toHaveLength(
      testBoard.length * testBoard[1].length
    );

    await userEvent.click(screen.getAllByRole("button")[2]);
    expect(screen.getAllByRole("button")[2].textContent).toBe("1");

    await userEvent.click(screen.getAllByRole("button")[4]);
    expect(screen.getAllByRole("button")[4].textContent).toBe("2");
  });

  it("should reveal all mines correctly after mouse left click on a mine", async () => {
    render(<TestComponent />);
    expect(screen.getAllByRole("button")).toHaveLength(
      testBoard.length * testBoard[1].length
    );

    expect(screen.queryAllByText("💣")).toHaveLength(0);

    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getAllByRole("button")[0].textContent).toBe("💣");

    expect(screen.getAllByText("💣")).toHaveLength(mineLocations.length);
  });

  it("should place a flag on the cell after mouse right click on a cell", async () => {
    render(<TestComponent />);
    expect(screen.getAllByRole("button")).toHaveLength(
      testBoard.length * testBoard[1].length
    );

    expect(screen.queryAllByText("🚩")).toHaveLength(0);

    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getAllByRole("button")[0],
    });
    expect(screen.getAllByRole("button")[0].textContent).toBe("🚩");

    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getAllByRole("button")[1],
    });
    expect(screen.getAllByRole("button")[1].textContent).toBe("🚩");

    expect(screen.getAllByText("🚩")).toHaveLength(2);
  });

  it("should reveal all mines in cheat mode", async () => {
    render(<TestComponent cheatMode={true} />);
    expect(screen.getAllByRole("button")).toHaveLength(
      testBoard.length * testBoard[1].length
    );

    expect(screen.getAllByText("💣")).toHaveLength(mineLocations.length);
  });
});
