// Base shared fields
export interface BasePuzzle {
  id: string;
  type: "math" | "word" | "pattern" | "odd" | "memory";
  question: string;
  difficulty: "easy" | "medium" | "hard";
}

/* ------------ MATH ------------ */
export interface MathPuzzle extends BasePuzzle {
  type: "math";
  solution: number;
}

/* ------------ WORD ------------ */
export interface WordPuzzle extends BasePuzzle {
  type: "word";
  letters: string[];
  solution: string;
}

/* ------------ PATTERN ------------ */
export interface PatternPuzzle extends BasePuzzle {
  type: "pattern";
  sequence: number[];
  solution: number;
}

/* ------------ ODD ONE ------------ */
export interface OddPuzzle extends BasePuzzle {
  type: "odd";
  options: string[];
  solution: string;
}

/* ------------ MEMORY ------------ */
export interface MemoryPuzzle extends BasePuzzle {
  type: "memory";
  grid: number[];
  solution: number[];
}

/* UNION TYPE (VERY IMPORTANT) */
export type Puzzle =
  | MathPuzzle
  | WordPuzzle
  | PatternPuzzle
  | OddPuzzle
  | MemoryPuzzle;
