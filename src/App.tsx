import { useState, useEffect } from "react";
import { settings, GameStatus, Setting } from "./constants";
import { generateMineSweeperBoard, generateMineLocations } from "./utils";
import { Board } from "./Board";
import { GameControl } from "./GameControl";
import "./App.scss";

export default function App() {
  const [setting, setSetting] = useState(settings[0]);
  const [flags, setFlags] = useState(setting.mineCounts);
  const [cheatMode, setCheatMode] = useState(false);
  const [board, setBoard] = useState(
    generateMineSweeperBoard(
      setting.boardSize,
      generateMineLocations(setting.boardSize, setting.mineCounts)
    )
  );

  const [status, setStatus] = useState(GameStatus.Playing);

  const customSetting = settings.at(-1) as Setting;
  const [customRowSize, setCustomRowSize] = useState(
    customSetting.boardSize[0]
  );
  const [customColSize, setCustomColSize] = useState(
    customSetting.boardSize[1]
  );
  const [customMineCounts, setCustomMineCounts] = useState(
    customSetting.mineCounts
  );

  useEffect(() => {
    handleRestartGame();
  }, [setting.difficulty, customRowSize, customColSize, customMineCounts]);

  const handleRestartGame = () => {
    setStatus(GameStatus.Playing);

    if (setting.difficulty === "Custom") {
      setFlags(customMineCounts);
      const customBoardSize: [number, number] = [customRowSize, customColSize];
      setBoard(
        generateMineSweeperBoard(
          customBoardSize,
          generateMineLocations(customBoardSize, customMineCounts)
        )
      );
    } else {
      setFlags(setting.mineCounts);
      setBoard(
        generateMineSweeperBoard(
          setting.boardSize,
          generateMineLocations(setting.boardSize, setting.mineCounts)
        )
      );
    }
  };

  return (
    <div className="App">
      <GameControl
        setting={setting}
        setSetting={setSetting}
        flags={flags}
        handleRestartGame={handleRestartGame}
        customColSize={customColSize}
        setCustomColSize={setCustomColSize}
        customRowSize={customRowSize}
        setCustomRowSize={setCustomRowSize}
        customMineCounts={customMineCounts}
        setCustomMineCounts={setCustomMineCounts}
        setCheatMode={setCheatMode}
      />
      <Board
        board={board}
        setBoard={setBoard}
        status={status}
        setStatus={setStatus}
        flags={flags}
        setFlags={setFlags}
        cheatMode={cheatMode}
      />
      {status !== GameStatus.Playing && (
        <button className={`info ${status}`} onClick={handleRestartGame}>
          <span>{`you ${status} (click here to play again)`}</span>
        </button>
      )}
    </div>
  );
}
