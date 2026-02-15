import { Puzzle } from "../types/puzzleTypes";


export function validateAnswer(puzzle: Puzzle, answer: unknown): boolean {
  return JSON.stringify(answer) === JSON.stringify(puzzle.solution);
}

