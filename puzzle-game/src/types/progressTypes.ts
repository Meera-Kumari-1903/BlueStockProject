export interface ProgressRecord {
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayed: string;   // YYYY-MM-DD
  solvedToday: boolean;
}
