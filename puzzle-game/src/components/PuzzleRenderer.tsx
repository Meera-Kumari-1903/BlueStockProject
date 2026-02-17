import React from "react";
import { Puzzle } from "../types/puzzleTypes";

import MathPuzzleView from "./puzzles/MathPuzzleView";
import WordPuzzleView from "./puzzles/WordPuzzleView";
import PatternPuzzleView from "./puzzles/PatternPuzzleView";
import OddPuzzleView from "./puzzles/OddPuzzleView";
import MemoryPuzzleView from "./puzzles/MemoryPuzzleView";

type Props = {
  puzzle: Puzzle;
  onSubmit: (answer: unknown) => void;
};

const PuzzleRenderer: React.FC<Props> = ({ puzzle, onSubmit }) => {

  switch (puzzle.type) {
    case "math":
      return <MathPuzzleView puzzle={puzzle} onSubmit={onSubmit} />;

    case "word":
      return <WordPuzzleView puzzle={puzzle} onSubmit={onSubmit} />;

    case "pattern":
      return <PatternPuzzleView puzzle={puzzle} onSubmit={onSubmit} />;

    case "odd":
      return <OddPuzzleView puzzle={puzzle} onSubmit={onSubmit} />;

    case "memory":
      return <MemoryPuzzleView puzzle={puzzle} onSubmit={onSubmit} />;

    default:
      return <h3>Unknown puzzle</h3>;
  }
};

export default PuzzleRenderer;
