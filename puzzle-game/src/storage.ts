import { dbPromise } from "./db";

export const saveProgress = async (uid: string, level: number, score: number) => {
  const db = await dbPromise;

  await db.put("progress", {
    uid,
    level,
    score,
    updatedAt: new Date().toISOString(),
  });
};

export const getProgress = async (uid: string) => {
  const db = await dbPromise;
  return await db.get("progress", uid);
};

export const clearProgress = async (uid: string) => {
  const db = await dbPromise;
  await db.delete("progress", uid);
};
