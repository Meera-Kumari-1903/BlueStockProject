const KEY = "logic_looper_difficulty";

export type Difficulty = "easy" | "medium" | "hard";

export const DifficultyManager = {

  get(): Difficulty {
    return (localStorage.getItem(KEY) as Difficulty) || "medium";
  },

  set(level: Difficulty) {
    localStorage.setItem(KEY, level);
  }

};
