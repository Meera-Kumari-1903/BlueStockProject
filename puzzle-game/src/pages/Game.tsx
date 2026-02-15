import {  useState } from "react";

import PuzzleRenderer from "../components/PuzzleRenderer";
import { getTodaySeed } from "../utils/dateSeed";
import { PuzzleEngine } from "../engine/PuzzleEngine";



interface Props {
  onSolved: () => void;
}

const Game: React.FC<Props> = () => {

  


  // generate puzzle only ONCE
  const [puzzle, setPuzzle] = useState(() => {
  const seed = getTodaySeed();
  return PuzzleEngine.generate(seed, "daily");
});


  if (!puzzle) return <h2>Loading puzzle...</h2>;

function handleSubmit(answer: unknown) {
  if (!puzzle) return;

  const correct = PuzzleEngine.validate(puzzle, answer);

  if (correct) {
    alert("✅ Correct Answer!");
  } else {
    alert("❌ Wrong Answer!");
  }
}

  return (
    <div>
      <PuzzleRenderer puzzle={puzzle} onSubmit={handleSubmit} />
    </div>
  );
};

export default Game;
