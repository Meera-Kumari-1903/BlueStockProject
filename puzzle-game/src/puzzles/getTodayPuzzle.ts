import { PuzzleEngine, Difficulty } from "../engine/PuzzleEngine";

/* ---------------- DATE SEED ---------------- */
/* Every day generates same number for all players */

function getTodaySeed(): number {
  const today = new Date();

  return (
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate()
  );
}

/* ---------------- DAILY PUZZLE ---------------- */

export function getTodayPuzzle(difficulty: Difficulty = "medium") {
  const seed = getTodaySeed();

  // same seed = same puzzle for everyone
  return PuzzleEngine.generate("daily", seed, difficulty);
}
