export interface ProgressRecord {
  uid: string;
  level: number;
  score: number;
  lastSolvedDate?: string;
}

const STORAGE_KEY = "puzzle_progress";

// SAVE
export async function saveProgress(
  uid: string,
  level: number,
  score: number
): Promise<void> {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  const record: ProgressRecord = {
    uid,
    level,
    score,
    lastSolvedDate: new Date().toDateString(),
  };

  all[uid] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// GET
export async function getProgress(uid: string): Promise<ProgressRecord | null> {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return all[uid] || null;
}
