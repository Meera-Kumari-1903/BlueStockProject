import { seededRandom } from "../utils/seededRandom";

import {
  Puzzle,
  MathPuzzle,
  WordPuzzle,
  PatternPuzzle,
  OddPuzzle,
  MemoryPuzzle,
} from "../types/puzzleTypes";

export class PuzzleEngine {

  // ------------------ MAIN ENTRY ------------------
  static generate(seed: number, type: string): Puzzle {

    const rand = seededRandom(seed);

    // daily random puzzle selection
    if (type === "daily") {
      const types = ["math", "word", "pattern", "odd", "memory"];
      type = types[Math.floor(rand() * types.length)];
    }

    switch (type) {
      case "math":
        return this.generateMath(seed);

      case "word":
        return this.generateWord(seed);

      case "pattern":
        return this.generatePattern(seed);

      case "odd":
        return this.generateOdd(seed);

      case "memory":
        return this.generateMemory(seed);

      default:
        throw new Error("Unknown puzzle type");
    }
  }

  // ------------------ VALIDATOR ------------------
  static validate(puzzle: Puzzle, userAnswer: unknown): boolean {

    // word puzzle → ignore case
    if (puzzle.type === "word") {
      return (
        String(userAnswer).toLowerCase().trim() ===
        String(puzzle.solution).toLowerCase().trim()
      );
    }

    // number puzzles
    if (typeof puzzle.solution === "number") {
      return Number(userAnswer) === puzzle.solution;
    }

    // array comparison (memory)
    if (Array.isArray(puzzle.solution)) {
      return JSON.stringify(userAnswer) === JSON.stringify(puzzle.solution);
    }

    return JSON.stringify(userAnswer) === JSON.stringify(puzzle.solution);
  }

  // ------------------ MATH ------------------
  private static generateMath(seed: number): MathPuzzle {
    const rand = seededRandom(seed);

    const a = Math.floor(rand() * 10);
    const b = Math.floor(rand() * 10);

    return {
      id: "math-" + seed,
      type: "math",
      question: `${a} + ${b}`,
      solution: a + b,
      difficulty: "easy",
    };
  }

  // ------------------ WORD ------------------
  private static generateWord(seed: number): WordPuzzle {
  const rand = seededRandom(seed);

  const words = ["react", "firebase", "engine", "puzzle", "coding", "logic"];
  const word = words[Math.floor(rand() * words.length)];

  const letters = word.split("");

  const scrambled = [...letters].sort(() => rand() - 0.5);

  return {
    id: "word-" + seed,
    type: "word",
    question: `Unscramble the word`,
    letters: scrambled,
    solution: word,
    difficulty: "easy",
  };
}


  // ------------------ PATTERN ------------------
  private static generatePattern(seed: number): PatternPuzzle {

    const rand = seededRandom(seed);

    const start = Math.floor(rand() * 5) + 1;
    const step = Math.floor(rand() * 5) + 2;

    const sequence = [
      start,
      start + step,
      start + step * 2,
      start + step * 3,
    ];

    return {
      id: "pattern-" + seed,
      type: "pattern",
      question: `Find the next number`,
      sequence,
      solution: start + step * 4,
      difficulty: "medium",
    };
  }

  // ------------------ ODD ONE ------------------
  private static generateOdd(seed: number): OddPuzzle {

    const groups = [
      ["Dog", "Cat", "Cow", "Car"],
      ["Apple", "Banana", "Mango", "Potato"],
      ["Red", "Blue", "Green", "Tiger"],
    ];

    const rand = seededRandom(seed);
    const group = groups[Math.floor(rand() * groups.length)];
    const solution = group[group.length - 1];

    return {
      id: "odd-" + seed,
      type: "odd",
      question: "Find the odd one out",
      options: group,
      solution,
      difficulty: "easy",
    };
  }

  // ------------------ MEMORY ------------------
private static generateMemory(seed: number): MemoryPuzzle {
  const rand = seededRandom(seed);

  const grid: number[] = Array.from({ length: 6 }, () =>
    Math.floor(rand() * 9) + 1
  );

  return {
    id: "memory-" + seed,
    type: "memory",
    question: `Memorize these numbers for 5 seconds`,
    grid,
    solution: grid,
    difficulty: "hard",
  };
}

}
