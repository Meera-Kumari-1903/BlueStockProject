import { getTodaySeed } from "../utils/dateSeed";
import { PuzzleEngine } from "../engine/PuzzleEngine";

export function getTodayPuzzle() {
  const seed = getTodaySeed();
  return PuzzleEngine.generate(seed, "daily");
}
