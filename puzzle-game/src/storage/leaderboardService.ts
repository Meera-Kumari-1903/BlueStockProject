import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export type LeaderboardPlayer = {
  name: string;
  score: number;
  streak: number;
};

export async function getTopPlayers(): Promise<LeaderboardPlayer[]> {

  const q = query(
    collection(db, "players"),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);

  const players: LeaderboardPlayer[] = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    players.push({
      name: data.name,
      score: data.score,
      streak: data.streak
    });
  });

  return players;
}
