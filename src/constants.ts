export interface Setting {
  difficulty: string;
  boardSize: [number, number];
  mineCounts: number;
}

export const settings: Setting[] = [
  {
    difficulty: "Beginner",
    boardSize: [9, 9],
    mineCounts: 10,
  },
  {
    difficulty: "Intermediate",
    boardSize: [16, 16],
    mineCounts: 40,
  },
  {
    difficulty: "Expert",
    boardSize: [16, 30],
    mineCounts: 99,
  },
  {
    difficulty: "Custom",
    boardSize: [5, 5],
    mineCounts: 5,
  },
];

export enum GameStatus {
  Won = "won",
  Lost = "lost",
  Playing = "playing",
}
