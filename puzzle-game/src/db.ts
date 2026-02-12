import { openDB } from "idb";

export const dbPromise = openDB("PuzzleGameDB", 1, {
  upgrade(db) {
    // user progress store
    if (!db.objectStoreNames.contains("progress")) {
      db.createObjectStore("progress", { keyPath: "uid" });
    }

    // game settings store
    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings", { keyPath: "id" });
    }
  },
});
