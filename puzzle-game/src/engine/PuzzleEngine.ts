import { seededRandom } from "../utils/seededRandom";
import { getTodaySeed } from "./dailySeed";

import {
  Puzzle,
  MathPuzzle,
  WordPuzzle,
  PatternPuzzle,
  OddPuzzle,
  MemoryPuzzle,
} from "../types/puzzleTypes";

export type Difficulty = "easy" | "medium" | "hard";

export class PuzzleEngine {
  // ------------------ MAIN ENTRY ------------------
  static generate(
    type: string,
    seed?: number,
    difficulty: Difficulty = "medium"
  ): Puzzle {
    if (!seed) seed = getTodaySeed();
    const rand = seededRandom(seed);

    // daily random puzzle selection
    if (type === "daily") {
      const types = ["math", "word", "pattern", "odd", "memory"];
      type = types[Math.floor(rand() * types.length)];
    }

    switch (type) {
      case "math":
        return this.generateMath(seed, difficulty);

      case "word":
        return this.generateWord(seed, difficulty);

      case "pattern":
        return this.generatePattern(seed, difficulty);

      case "odd":
        return this.generateOdd(seed, difficulty);

      case "memory":
        return this.generateMemory(seed, difficulty);

      default:
        throw new Error("Unknown puzzle type");
    }
  }

  // ------------------ VALIDATOR ------------------
  static validate(puzzle: Puzzle, userAnswer: unknown): boolean {
    if (puzzle.type === "word") {
      return (
        String(userAnswer).toLowerCase().trim() ===
        String(puzzle.solution).toLowerCase().trim()
      );
    }
    if (typeof puzzle.solution === "number") {
      return Number(userAnswer) === puzzle.solution;
    }
    if (Array.isArray(puzzle.solution)) {
      return JSON.stringify(userAnswer) === JSON.stringify(puzzle.solution);
    }
    return JSON.stringify(userAnswer) === JSON.stringify(puzzle.solution);
  }

  // ------------------ MATH ------------------
  private static generateMath(seed: number, difficulty: Difficulty): MathPuzzle {
    const rand = seededRandom(seed);
    let max = 10;
    if (difficulty === "medium") max = 20;
    if (difficulty === "hard") max = 50;

    const a = Math.floor(rand() * max);
    const b = Math.floor(rand() * max);

    return {
      id: `math-${seed}-${difficulty}`,
      type: "math",
      question: `${a} + ${b}`,
      solution: a + b,
      difficulty,
    };
  }

  // ------------------ WORD ------------------
  private static generateWord(seed: number, difficulty: Difficulty): WordPuzzle {
    const rand = seededRandom(seed);

    const easyWords = ["cat", "dog", "book", "tree"];
    const mediumWords = ["react", "firebase", "puzzle", "coding"];
    const hardWords = ["algorithm", "interface", "component", "javascript"];

    let words: string[] = mediumWords;
    if (difficulty === "easy") words = easyWords;
    if (difficulty === "hard") words = hardWords;

    const word = words[Math.floor(rand() * words.length)];
    const letters = word.split("");
    const scrambled = [...letters].sort(() => rand() - 0.5);

    return {
      id: `word-${seed}-${difficulty}`,
      type: "word",
      question: `Unscramble the word`,
      letters: scrambled,
      solution: word,
      difficulty,
    };
  }

  // ------------------ PATTERN ------------------
  private static generatePattern(
    seed: number,
    difficulty: Difficulty
  ): PatternPuzzle {
    const rand = seededRandom(seed);

    let start = Math.floor(rand() * 5) + 1;
    let step = Math.floor(rand() * 5) + 1;

    if (difficulty === "medium") {
      step += Math.floor(rand() * 5);
    }
    if (difficulty === "hard") {
      step += Math.floor(rand() * 10);
      start += Math.floor(rand() * 5);
    }

    const sequence = [start, start + step, start + step * 2, start + step * 3];

    return {
      id: `pattern-${seed}-${difficulty}`,
      type: "pattern",
      question: `Find the next number`,
      sequence,
      solution: start + step * 4,
      difficulty,
    };
  }

  // ------------------ ODD ONE ------------------
  private static generateOdd(seed: number, difficulty: Difficulty): OddPuzzle {
    const rand = seededRandom(seed);

    const groups: Record<Difficulty, string[][]> = {
      easy: [
        ["Dog", "Cat", "Cow", "Car"],
        ["Red", "Blue", "Green", "Tiger"],
      ],
      medium: [
        ["Apple", "Banana", "Mango", "Potato"],
        ["Circle", "Square", "Triangle", "Dog"],
      ],
      hard: [
        ["Python", "Java", "C++", "Elephant"],
        ["Mercury", "Venus", "Mars", "Saturn", "Tiger"],
      ],
    };

    const groupList = groups[difficulty];
    const group = groupList[Math.floor(rand() * groupList.length)];
    const solution = group[group.length - 1];

    return {
      id: `odd-${seed}-${difficulty}`,
      type: "odd",
      question: "Find the odd one out",
      options: group,
      solution,
      difficulty,
    };
  }

  // ------------------ MEMORY ------------------
  private static generateMemory(seed: number, difficulty: Difficulty): MemoryPuzzle {
    const rand = seededRandom(seed);
    let length = 6;
    if (difficulty === "medium") length = 8;
    if (difficulty === "hard") length = 10;

    const grid: number[] = Array.from({ length }, () =>
      Math.floor(rand() * 9) + 1
    );

    return {
      id: `memory-${seed}-${difficulty}`,
      type: "memory",
      question: `Memorize these numbers for 5 seconds`,
      grid,
      solution: grid,
      difficulty,
    };
  }
}
