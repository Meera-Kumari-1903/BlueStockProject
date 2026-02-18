import { Achievements } from "../storage/achievementManager";

export function checkAchievements(streak: number, score: number, time: number) {

  const unlocked: string[] = [];

  if (score >= 10 && Achievements.unlock("first_solve"))
    unlocked.push("First Solve 🧩");

  if (streak >= 3 && Achievements.unlock("streak_3"))
    unlocked.push("3 Day Streak 🔥");

  if (streak >= 7 && Achievements.unlock("streak_7"))
    unlocked.push("7 Day Streak 🧠");

  if (score >= 50 && Achievements.unlock("brain_master"))
    unlocked.push("Brain Master 👑");

  if (time <= 60 && Achievements.unlock("speed_solver"))
    unlocked.push("Speed Solver ⚡");

  return unlocked;
}
