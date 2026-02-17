import { ProgressRecord } from "../types/progressTypes";
import { todayLocal, yesterdayLocal } from "../utils/dateUtils";

const STORAGE_KEY = "puzzle-progress";

export class ProgressManager {

  // ---------------- LOAD ----------------
  static load(): ProgressRecord {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        totalScore: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastPlayed: "",
        solvedToday: false,
      };
    }

    try {
      return JSON.parse(saved);
    } catch {
      // corrupted storage fallback
      return {
        totalScore: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastPlayed: "",
        solvedToday: false,
      };
    }
  }

  // ---------------- SAVE ----------------
  static save(record: ProgressRecord) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }

  // ---------------- CAN PLAY TODAY ----------------
  static canPlayToday(): boolean {
    const record = this.load();
    const today = todayLocal();

    // already solved today → locked
    if (record.lastPlayed === today && record.solvedToday) {
      return false;
    }

    return true;
  }

  // ---------------- RECORD WIN (REAL STREAK LOGIC) ----------------
  static recordWin(): ProgressRecord {
    const record = this.load();

    const today = todayLocal();
    const yesterday = yesterdayLocal();

    // Prevent duplicate solve same day
    if (record.lastPlayed === today && record.solvedToday) {
      return record;
    }

    // Continue streak
    if (record.lastPlayed === yesterday) {
      record.currentStreak += 1;
    }
    // Missed day → reset
    else {
      record.currentStreak = 1;
    }

    record.lastPlayed = today;
    record.solvedToday = true;
    record.totalScore += 1;

    // update best streak
    if (record.currentStreak > record.bestStreak) {
      record.bestStreak = record.currentStreak;
    }

    this.save(record);
    return record;
  }

  // ---------------- RESET NEW DAY FLAG ----------------
  static resetDailyFlagIfNeeded() {
    const record = this.load();
    const today = todayLocal();

    // new day opened
    if (record.lastPlayed !== today) {
      record.solvedToday = false;
      this.save(record);
    }
  }
}
