import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export type CloudPlayerData = {
  displayName: string;
  email: string;
  score: number;
  streak: number;
  level: number;
  lastSolved: string;
};

// Save / Create player
export const savePlayerToCloud = async (
  uid: string,
  data: CloudPlayerData
) => {
  const ref = doc(db, "players", uid);

  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

// Get player
export const getPlayerFromCloud = async (uid: string) => {
  const ref = doc(db, "players", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data() as CloudPlayerData;
};

// Update score/streak after win
export const updateAfterWin = async (
  uid: string,
  score: number,
  streak: number,
  level: number
) => {
  const ref = doc(db, "players", uid);

  await updateDoc(ref, {
    score,
    streak,
    level,
    lastSolved: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  });
};
