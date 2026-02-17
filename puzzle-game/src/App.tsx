import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { PuzzleEngine } from "./engine/PuzzleEngine";
import Game from "./pages/Game";
import { getMsUntilMidnight, formatCountdown } from "./utils/timeUtils";


import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { ProgressManager } from "./storage/progress";

function App() {

  // ---------------- USER ----------------
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------- PLAYER STATS ----------------
  const initialProgress = ProgressManager.load();

  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(initialProgress.totalScore);
  const [streak, setStreak] = useState<number>(initialProgress.currentStreak);
  const [canPlay, setCanPlay] = useState<boolean>(ProgressManager.canPlayToday());
  const [timeLeft, setTimeLeft] = useState<number>(getMsUntilMidnight());

  useEffect(() => {
  if (canPlay) return;

  const interval = setInterval(() => {
    const remaining = getMsUntilMidnight();
    setTimeLeft(remaining);

    // midnight reached → unlock automatically
    if (remaining <= 0) {
      ProgressManager.resetDailyFlagIfNeeded();
      setCanPlay(true);
      setPuzzle(PuzzleEngine.generate("daily"));
    }
  }, 1000);

  return () => clearInterval(interval);
}, [canPlay]);


  // ---------------- DAILY RESET CHECK ----------------
  useEffect(() => {
    ProgressManager.resetDailyFlagIfNeeded();
    setCanPlay(ProgressManager.canPlayToday());
    setStreak(ProgressManager.load().currentStreak);
  }, []);

  // ---------------- DAILY PUZZLE ----------------
  const [puzzle] = useState(() => PuzzleEngine.generate("daily"));

  // ---------------- AUTH LISTENER ----------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u: User | null) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await signOut(auth);
    setLevel(1);
    setScore(0);
    setStreak(0);
  };

  // ---------------- PUZZLE SOLVED ----------------
  const onPuzzleSolved = () => {
    if (!user) return;

    const record = ProgressManager.recordWin();

    // update UI
    setStreak(record.currentStreak);
    setScore(record.totalScore);
    setCanPlay(false);

    // simple level system
    setLevel(prev => prev + 1);
  };

  // ---------------- LOADING SCREEN ----------------
  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // ---------------- LOGIN SCREEN ----------------
  if (!user) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h1>🧩 Logic Looper</h1>
          <p>Sharpen your brain everyday!</p>

          <button style={styles.loginBtn} onClick={handleLogin}>
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  // ---------------- GAME SCREEN ----------------
  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <p>{user.email}</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* STATS */}
      <div style={styles.stats}>
        <div style={styles.statBox}>
          <h3>Level</h3>
          <p>{level}</p>
        </div>

        <div style={styles.statBox}>
          <h3>Score</h3>
          <p>{score}</p>
        </div>

        <div style={styles.statBox}>
          <h3>🔥 Streak</h3>
          <p>{streak}</p>
        </div>
      </div>

      {/* LOCK MESSAGE */}
      {!canPlay && (
       <div style={styles.lockBox}>
  <h2>🎉 Puzzle Completed!</h2>
  <p>Your streak continues 🔥</p>

  <h3 style={{ marginTop: "15px" }}>
    Next puzzle in:
  </h3>

  <div style={styles.timer}>
    {formatCountdown(timeLeft)}
  </div>
</div>

      )}

      {/* PUZZLE */}
      {canPlay && <Game puzzle={puzzle} onSolved={onPuzzleSolved} />}

    </div>
  );
}

export default App;


// ---------------- STYLES ----------------

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f4f8",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  loginBtn: {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "#4285F4",
    color: "white",
    cursor: "pointer",
    marginTop: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  logoutBtn: {
    padding: "8px 16px",
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  stats: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },

  statBox: {
    flex: 1,
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  lockBox: {
    background: "#fff3cd",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    marginTop: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  timer: {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px",
  color: "#e65100",
  letterSpacing: "2px",
},

};
