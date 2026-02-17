import React from "react";
import { Puzzle } from "../types/puzzleTypes";
import PuzzleRenderer from "../components/PuzzleRenderer";
import { PuzzleEngine } from "../engine/PuzzleEngine";

type Props = {
  puzzle: Puzzle;
  onSolved: () => void;
};

const Game: React.FC<Props> = ({ puzzle, onSolved }) => {

  const handleSubmit = (answer: unknown) => {
    const correct = PuzzleEngine.validate(puzzle, answer);

    if (correct) {
      alert("✅ Correct Answer!");
      onSolved();
    } else {
      alert("❌ Wrong Answer. Try again!");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Today's Puzzle</h2>
      <PuzzleRenderer puzzle={puzzle} onSubmit={handleSubmit} />
    </div>
  );
};

export default Game;
