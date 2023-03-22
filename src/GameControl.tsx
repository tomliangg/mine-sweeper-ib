import { FC } from "react";
import { Setting, settings } from "./constants";
import { clamp } from "./utils";
const MIN_SIZE = 2;
const MAX_SIZE = 50;

interface GameControlProps {
  setting: Setting;
  setSetting: (newSetting: Setting) => void;
  flags: number;
  handleRestartGame: VoidFunction;
  setCheatMode: (mode: boolean) => void;
  customRowSize: number;
  setCustomRowSize: (size: number) => void;
  customColSize: number;
  setCustomColSize: (size: number) => void;
  customMineCounts: number;
  setCustomMineCounts: (size: number) => void;
}

export const GameControl: FC<GameControlProps> = ({
  setting,
  setSetting,
  flags,
  setCheatMode,
  handleRestartGame,
  customRowSize,
  setCustomRowSize,
  customColSize,
  setCustomColSize,
  customMineCounts,
  setCustomMineCounts,
}) => {
  return (
    <div>
      <label htmlFor="difficulty">Choose a difficulty:</label>
      <select
        className="selectDifficulty"
        name="difficulty"
        onChange={(e) => {
          setSetting(JSON.parse(e.target.value));
        }}
      >
        {settings.map((setting, index) => (
          <option
            key={setting.difficulty}
            value={JSON.stringify(settings[index])}
          >
            {setting.difficulty}
          </option>
        ))}
      </select>
      <br />
      {setting.difficulty === "Custom" && (
        <>
          <label htmlFor="rowSize">Row size:</label>
          <input
            value={customRowSize}
            type="number"
            name="rowSize"
            min={MIN_SIZE}
            max={MAX_SIZE}
            onChange={(e) => {
              const input = Number(e.target.value) || 1;
              const newRowSize = clamp(input, MIN_SIZE, MAX_SIZE);
              setCustomRowSize(newRowSize);
              if (newRowSize * customColSize <= customMineCounts) {
                setCustomMineCounts(newRowSize * customColSize - 1);
              }
            }}
          />
          <br />
          <label htmlFor="colSize">Col size:</label>
          <input
            value={customColSize}
            type="number"
            name="colSize"
            min={MIN_SIZE}
            max={MAX_SIZE}
            onChange={(e) => {
              const input = Number(e.target.value) || 1;
              const newColSize = clamp(input, MIN_SIZE, MAX_SIZE);
              setCustomColSize(newColSize);
              if (newColSize * customRowSize <= customMineCounts) {
                setCustomMineCounts(newColSize * customRowSize - 1);
              }
            }}
          />
          <br />
          <label htmlFor="mineSize">Mines:</label>
          <input
            value={customMineCounts}
            type="number"
            name="mineSize"
            min={1}
            max={customRowSize * customColSize - 1}
            onChange={(e) => {
              const newMineCounts = Math.min(
                Number(e.target.value) || 1,
                customRowSize * customColSize - 1
              );
              setCustomMineCounts(newMineCounts);
            }}
          />
          <br />
        </>
      )}
      <label htmlFor="cheatMode"> Cheat mode</label>
      <input
        type="checkbox"
        name="cheatMode"
        onChange={(e) => setCheatMode(e.target.checked)}
      />
      <p>Flags: {flags}</p>
      <p>Mines: {setting.mineCounts}</p>
      <button className="restartBtn" onClick={handleRestartGame}>
        Restart game
      </button>
    </div>
  );
};
