import React, { useState } from "react";
import { WordPuzzle } from "../../types/puzzleTypes";

interface Props {
  puzzle: WordPuzzle;
  onSubmit: (answer: string) => void;
}

const WordPuzzleView: React.FC<Props> = ({ puzzle, onSubmit }) => {

  const [guess, setGuess] = useState("");

  return (
    <div>
      <h2>Unscramble the word</h2>

      <h1>{puzzle.letters.join(" ")}</h1>

      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />

      <button onClick={() => onSubmit(guess)}>
        Submit
      </button>
    </div>
  );
};

export default WordPuzzleView;
