import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "firebase/auth";

function today() {
  return new Date().toISOString().split("T")[0]; // 2026-02-18
}

export async function loadOrCreatePlayer(user: User) {
  const ref = doc(db, "players", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const newPlayer = {
      name: user.displayName,
      email: user.email,
      score: 0,
      streak: 0,
      history: [],  // ⭐ important
    };

    await setDoc(ref, newPlayer);
    return newPlayer;
  }

  return snap.data();
}

export async function updatePlayerStats(user: User, score: number, streak: number) {
  const ref = doc(db, "players", user.uid);

  await updateDoc(ref, {
    score,
    streak,
    history: arrayUnion(today()), // ⭐ record played day
    lastPlayed: today()
  });
}
