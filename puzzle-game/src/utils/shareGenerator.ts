import { ProgressManager } from "../engine/ProgressManager";


function getTodayDate(): string {
  return new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function generateShareText(time: number, score: number): string {
  const record = ProgressManager.load();

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedTime =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");

  const date = getTodayDate();

  // emoji performance bar
  let performance = "🟩🟩🟩🟩🟩";

  if (time > 180) performance = "🟨🟨🟨🟨⬜";
  if (time > 300) performance = "🟥🟥🟥⬜⬜";

  return `🧩 Logic Looper – Daily Puzzle
📅 ${date}

⏱ Time: ${formattedTime}
🔥 Streak: ${record.currentStreak}
⭐ Score: ${score}

${performance}

Play here:
https://your-vercel-link.vercel.app`;
}
