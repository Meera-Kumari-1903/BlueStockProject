import { PatternPuzzle } from "../../types/puzzleTypes";
import { useState } from "react";

interface Props {
  puzzle: PatternPuzzle;
  onSubmit: (answer: number) => void;
}

const PatternPuzzleView: React.FC<Props> = ({ puzzle, onSubmit }) => {

  const [ans, setAns] = useState("");

  return (
    <div>
      <h2>Find the next number:</h2>
      <h1>{puzzle.sequence.join(", ")}</h1>

      <input
        type="number"
        value={ans}
        onChange={(e) => setAns(e.target.value)}
      />

      <button onClick={() => onSubmit(Number(ans))}>
        Submit
      </button>
    </div>
  );
};

export default PatternPuzzleView;
