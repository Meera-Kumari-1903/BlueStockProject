import { Puzzle } from "../types/puzzleTypes";

import MathPuzzleView from "./puzzles/MathPuzzleView";
import WordPuzzleView from "./puzzles/WordPuzzleView";
import PatternPuzzleView from "./puzzles/PatternPuzzleView";
import OddPuzzleView from "./puzzles/OddPuzzleView";
import MemoryPuzzleView from "./puzzles/MemoryPuzzleView";

interface Props {
  puzzle: Puzzle;
  onSubmit: (answer: unknown) => void;
}

export default function PuzzleRenderer({ puzzle, onSubmit }: Props) {

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
      return <div>Unknown Puzzle</div>;
  }
}
