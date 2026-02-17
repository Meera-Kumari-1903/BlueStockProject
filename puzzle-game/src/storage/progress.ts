// src/storage/progress.ts

export interface ProgressRecord {
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string;   // date you LAST solved a puzzle
  solvedToday: boolean;     // daily lock
  xp: number;
  level: number;
}

const STORAGE_KEY = "puzzle_progress";

export class ProgressManager {

  // ---------------- LOAD ----------------
  static load(): ProgressRecord {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      const fresh: ProgressRecord = {
        totalScore: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastPlayedDate: "",
        solvedToday: false,
        xp: 0,
        level: 1,
      };
      this.save(fresh);
      return fresh;
    }

    return JSON.parse(saved);
  }

  // ---------------- SAVE ----------------
  static save(record: ProgressRecord) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }

  // ---------------- DATE HELPERS ----------------
  static today(): string {
    return new Date().toDateString();
  }

  static yesterday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toDateString();
  }

  // ---------------- CAN PLAY TODAY ----------------
  static canPlayToday(): boolean {
    const record = this.load();
    return !record.solvedToday;
  }

  // ---------------- DAILY RESET ----------------
  static resetDailyFlagIfNeeded() {
    const record = this.load();
    const today = this.today();

    if (record.lastPlayedDate !== today) {
      record.solvedToday = false;
      this.save(record);
    }
  }

  // ---------------- XP + LEVEL SYSTEM ----------------
  static addXP(record: ProgressRecord, amount: number) {
    record.xp += amount;

    // level formula: each level needs more XP
    const neededXP = record.level * 50;

    if (record.xp >= neededXP) {
      record.xp = record.xp - neededXP;
      record.level += 1;
      console.log("LEVEL UP!");
    }
  }

  // ---------------- WHEN PLAYER SOLVES PUZZLE ----------------
  static recordWin(): ProgressRecord {
    const record = this.load();

    const today = this.today();
    const yesterday = this.yesterday();

    // already solved today (safety)
    if (record.solvedToday) return record;

    // ----- STREAK LOGIC -----
    if (record.lastPlayedDate === yesterday) {
      // continued streak
      record.currentStreak += 1;
    } else if (record.lastPlayedDate !== today) {
      // streak broken OR first play
      record.currentStreak = 1;
    }

    // best streak
    if (record.currentStreak > record.bestStreak) {
      record.bestStreak = record.currentStreak;
    }

    // mark today solved
    record.solvedToday = true;
    record.lastPlayedDate = today;

    // score
    record.totalScore += 1;

    // XP reward
    this.addXP(record, 10);

    this.save(record);
    return record;
  }
}
