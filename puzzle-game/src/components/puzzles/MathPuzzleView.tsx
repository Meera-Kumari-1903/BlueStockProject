import React, { useState } from "react";
import { MathPuzzle } from "../../types/puzzleTypes";

interface Props {
  puzzle: MathPuzzle;
  onSubmit: (answer: number) => void;
}

const MathPuzzleView: React.FC<Props> = ({ puzzle, onSubmit }) => {

  const [answer, setAnswer] = useState("");

  return (
    <div>
      <h2>Solve:</h2>
      <h1>{puzzle.question}</h1>

      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={() => onSubmit(Number(answer))}>
        Submit
      </button>
    </div>
  );
};

export default MathPuzzleView;
