import { useState, useEffect, useRef } from "react";
import { Puzzle } from "../types/puzzleTypes";
import PuzzleRenderer from "../components/PuzzleRenderer";
import { PuzzleEngine } from "../engine/PuzzleEngine";
import { generateShareText } from "../utils/shareGenerator";
import { checkAchievements } from "../engine/achievementChecker";


type Props = {
  puzzle: Puzzle;
  onSolved: () => void;
};

const Game: React.FC<Props> = ({ puzzle, onSolved }) => {

  const [completed, setCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  // ⭐ useRef instead of state (VERY IMPORTANT)
  const startTimeRef = useRef<number>(0);

  // start timer when puzzle loads
  useEffect(() => {
  startTimeRef.current = Date.now();
  // ✅ Wrap in setTimeout to avoid cascading renders
  setTimeout(() => {
    setCompleted(false);
    setTimeTaken(0);
  }, 0);
}, [puzzle]);

const handleSubmit = (answer: unknown) => {
  const correct = PuzzleEngine.validate(puzzle, answer);

  if (correct) {
    const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setTimeTaken(seconds);
    setCompleted(true);

    onSolved();

    // check achievements
    const unlocked = checkAchievements(
      Number(localStorage.getItem("logic_looper_streak") || 0),
      Number(localStorage.getItem("logic_looper_score") || 0),
      seconds
    );

    if (unlocked.length > 0) {
      alert("🏆 Achievement Unlocked!\n\n" + unlocked.join("\n"));
    } else {
      alert("✅ Correct Answer!");
    }
  } else {
    alert("❌ Wrong Answer. Try again!");
  }
};


  const handleShare = async () => {
    const shareText = generateShareText(timeTaken, 100);

    await navigator.clipboard.writeText(shareText);
    alert("Result copied! Now paste on WhatsApp or LinkedIn 😄");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Today's Puzzle</h2>

      <PuzzleRenderer puzzle={puzzle} onSubmit={handleSubmit} />

      {/* SHOW ONLY AFTER COMPLETION */}
      {completed && (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <p><b>⏱ Time Taken:</b> {timeTaken} seconds</p>

          <button
            onClick={handleShare}
            style={{
              background: "#22c55e",
              color: "white",
              padding: "12px 20px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            📤 Share Result
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
