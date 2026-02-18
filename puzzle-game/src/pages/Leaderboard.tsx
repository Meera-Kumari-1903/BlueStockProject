import  { useEffect, useState } from "react";
import { getTopPlayers, LeaderboardPlayer } from "../storage/leaderboardService";

function Leaderboard() {

  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTopPlayers();
      setPlayers(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <h2 style={{textAlign:"center"}}>Loading Leaderboard...</h2>;

  return (
    <div style={styles.container}>
      <h1>🏆 Global Leaderboard</h1>

      {players.map((p, i) => (
        <div key={i} style={styles.row}>
          <div style={styles.rank}>#{i+1}</div>
          <div style={styles.name}>{p.name}</div>
          <div style={styles.score}>⭐ {p.score}</div>
          <div style={styles.streak}>🔥 {p.streak}</div>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;

const styles = {
  container: {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #eee"
  },
  rank: { width: "50px", fontWeight: "bold" },
  name: { flex: 1 },
  score: { width: "100px" },
  streak: { width: "100px" }
};
