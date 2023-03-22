import { generateMineSweeperBoard, generateMineLocations } from "./utils";
import { describe, it, expect } from "vitest";

describe("generateMineSweeperBoard", () => {
  it("should correctly generate a board given the size and mine locations", () => {
    const sizeA: [number, number] = [5, 5];
    const mineLocationsA: Array<[number, number]> = [
      [0, 0],
      [0, 1],
    ];
    const boardA = generateMineSweeperBoard(sizeA, mineLocationsA);
    expect(boardA).toEqual([
      ["m", "m", 1, 0, 0],
      [2, 2, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    const sizeB: [number, number] = [3, 3];
    const mineLocationsB: Array<[number, number]> = [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ];
    const boardB = generateMineSweeperBoard(sizeB, mineLocationsB);
    expect(boardB).toEqual([
      ["m", 2, "m"],
      [2, 4, 2],
      ["m", 2, "m"],
    ]);
  });
});

describe("generateMineLocations", () => {
  it("should generate a correct number of mines", () => {
    const mineCounts = 5;
    const size: [number, number] = [5, 5];
    const locations = generateMineLocations(size, mineCounts);
    expect(locations).toHaveLength(mineCounts);
  });

  it("should generate mines at random locations", () => {
    const mineCounts = 1;
    const size: [number, number] = [10, 10];
    const locations = generateMineLocations(size, mineCounts);

    // can only use console.log() to manually verify random
    console.log(locations);
  });

  it("should throw an error when the number of mines is more than the number of cells", () => {
    const mineCounts = 10;
    const size: [number, number] = [3, 3];

    expect(() => generateMineLocations(size, mineCounts)).toThrowError(
      "too many mines for the board"
    );
  });
});
