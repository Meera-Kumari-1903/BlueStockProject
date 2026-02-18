import { UserSession } from "./userSession";

const BASE_KEY = "logic_looper_last_solved";

export const DailySession = {

  key() {
    return UserSession.key(BASE_KEY);
  },

  // today's unique date string
  todayKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
  },

  // did this user solve today's puzzle?
  hasSolvedToday(): boolean {
    const stored = localStorage.getItem(this.key());
    return stored === this.todayKey();
  },

  // mark puzzle as solved
  markSolvedToday(): void {
    localStorage.setItem(this.key(), this.todayKey());
  },

  // new day detection
  resetIfNewDay(): void {
    const stored = localStorage.getItem(this.key());
    if (!stored) return;

    if (stored !== this.todayKey()) {
      localStorage.removeItem(this.key());
    }
  }
};
