import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { saveProgress, getProgress } from "./storage/progress";
import Game from "./pages/Game";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // ---------------- AUTH LISTENER ----------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u) {
        // load saved progress
        getProgress(u.uid).then((data) => {
          if (data) {
            setLevel(data.level);
            setScore(data.score);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
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
  };

  // ---------------- PUZZLE SOLVED ----------------
  const onPuzzleSolved = async () => {
    if (!user) return;

    const newLevel = level + 1;
    const newScore = score + 10;

    setLevel(newLevel);
    setScore(newScore);

    await saveProgress(user.uid, newLevel, newScore);
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
          <h1>🧩 Daily Puzzle Game</h1>
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
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <p>{user.email}</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statBox}>
          <h3>Level</h3>
          <p>{level}</p>
        </div>

        <div style={styles.statBox}>
          <h3>Score</h3>
          <p>{score}</p>
        </div>
      </div>

      {/* Puzzle Engine */}
      <Game onSolved={onPuzzleSolved} />
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
};
