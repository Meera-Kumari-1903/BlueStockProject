import { OddPuzzle } from "../../types/puzzleTypes";

interface Props {
  puzzle: OddPuzzle;
  onSubmit: (answer: string) => void;
}

const OddPuzzleView: React.FC<Props> = ({ puzzle, onSubmit }) => {

  return (
    <div>
      <h2>Find the odd one out</h2>

      {puzzle.options.map((opt) => (
        <button key={opt} onClick={() => onSubmit(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
};

export default OddPuzzleView;
