import { MemoryPuzzle } from "../../types/puzzleTypes";

interface Props {
  puzzle: MemoryPuzzle;
  onSubmit: (answer: number[]) => void;
}


const MemoryPuzzleView: React.FC<Props> = ({ puzzle, onSubmit }) => {

  return (
    <div>
      <h2>Memorize these:</h2>
      <h1>{puzzle.grid.join(" ")}</h1>

      <button onClick={() => onSubmit(puzzle.grid)}>
        I Remember
      </button>
    </div>
  );
};

export default MemoryPuzzleView;
