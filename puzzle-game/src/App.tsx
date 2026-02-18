import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { PuzzleEngine, Difficulty } from "./engine/PuzzleEngine";
import Game from "./pages/Game";
import { getMsUntilMidnight, formatCountdown } from "./utils/timeUtils";
import { generateShareText } from "./utils/shareGenerator";
import { loadOrCreatePlayer, updatePlayerStats } from "./storage/playerService";
import Leaderboard from "./pages/Leaderboard";
import Heatmap from "./pages/Heatmap";
import { UserSession } from "./storage/userSession";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { ProgressManager } from "./engine/ProgressManager";

function App() {

  // -------- SESSION MODE --------
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // -------- USER --------
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // -------- PLAYER --------
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // -------- DIFFICULTY --------
  const [difficulty, setDifficulty] = useState<Difficulty>(
    () => (localStorage.getItem("difficulty") as Difficulty) || "medium"
  );

  // -------- PUZZLE --------
  const [canPlay, setCanPlay] = useState(ProgressManager.canPlayToday());
  const [timeLeft, setTimeLeft] = useState(getMsUntilMidnight());
  const [puzzle, setPuzzle] = useState(() =>
    PuzzleEngine.generate("daily", undefined, difficulty)
  );

  /* ======================================================
      NETWORK LISTENER (MOST IMPORTANT PART)
     ====================================================== */

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  /* ======================================================
      SESSION INITIALIZATION
     ====================================================== */

  useEffect(() => {

    // -------- OFFLINE MODE --------
    if (isOffline) {
      console.log("Running in OFFLINE MODE");

      UserSession.startGuest();

      setScore(Number(localStorage.getItem("score") || 0));
      setStreak(Number(localStorage.getItem("streak") || 0));
      setCanPlay(ProgressManager.canPlayToday());
      setUser(null);
      setLoading(false);

      return;
    }

    // -------- ONLINE MODE --------
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const player = await loadOrCreatePlayer(u);

        setScore(player.score || 0);
        setStreak(player.streak || 0);
        setCanPlay(ProgressManager.canPlayToday());
      }

      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [isOffline]);

  /* ======================================================
      MIDNIGHT RESET
     ====================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getMsUntilMidnight();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        ProgressManager.resetDailyFlagIfNeeded();
        setCanPlay(true);
        setPuzzle(PuzzleEngine.generate("daily", undefined, difficulty));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [difficulty]);

  /* ======================================================
      AUTH
     ====================================================== */

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    if (user) await signOut(auth);
    UserSession.clear();
    setUser(null);
    setLevel(1);
    setScore(0);
    setStreak(0);
    setCanPlay(true);
  };

  const handleGuestPlay = () => {
    UserSession.startGuest();
    setUser(null);
    setCanPlay(ProgressManager.canPlayToday());
    setPuzzle(PuzzleEngine.generate("daily", undefined, difficulty));
  };

  /* ======================================================
      DIFFICULTY
     ====================================================== */

  const handleDifficultyChange = (level: Difficulty) => {
    setDifficulty(level);
    localStorage.setItem("difficulty", level);
    setPuzzle(PuzzleEngine.generate("daily", undefined, level));
  };

  /* ======================================================
      PUZZLE SOLVED
     ====================================================== */

  const onPuzzleSolved = async () => {
    const record = ProgressManager.recordWin();

    setStreak(record.currentStreak);
    setScore(record.totalScore);
    setCanPlay(false);
    setLevel((prev) => prev + 1);

    // offline save
    localStorage.setItem("score", String(record.totalScore));
    localStorage.setItem("streak", String(record.currentStreak));

    // online sync
    if (user && !isOffline) {
      await updatePlayerStats(user, record.totalScore, record.currentStreak);
    }
  };

  /* ======================================================
      SHARE
     ====================================================== */

  const handleShare = async () => {
    const shareText = generateShareText(timeLeft, score);
    await navigator.clipboard.writeText(shareText);
    alert("Result copied! Share it!");
  };

  /* ======================================================
      UI
     ====================================================== */

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user && !UserSession.isGuest()) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h1>🧩 Logic Looper</h1>
          <p>Sharpen your brain everyday!</p>

          <div style={{ marginBottom: 15 }}>
            <h3>Select Difficulty</h3>
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                style={{
                  ...styles.difficultyBtn,
                  background: difficulty === level ? "#4285F4" : "#ddd",
                  color: difficulty === level ? "#fff" : "#333",
                }}
                onClick={() => handleDifficultyChange(level as Difficulty)}
              >
                {level}
              </button>
            ))}
          </div>

          <button style={styles.loginBtn} onClick={handleLogin}>
            Login with Google
          </button>

          <div style={{ marginTop: 15 }}>
            <button style={styles.guestBtn} onClick={handleGuestPlay}>
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <h2>Welcome {user?.displayName || "Guest"}</h2>
          <p>{isOffline ? "Offline Mode" : user?.email}</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.stats}>
        <div style={styles.statBox}><h3>Level</h3><p>{level}</p></div>
        <div style={styles.statBox}><h3>Score</h3><p>{score}</p></div>
        <div style={styles.statBox}><h3>🔥 Streak</h3><p>{streak}</p></div>
      </div>

      {!canPlay && (
        <div style={styles.lockBox}>
          <h2>Puzzle Completed!</h2>
          <p>Next puzzle in</p>
          <div style={styles.timer}>{formatCountdown(timeLeft)}</div>
          <button style={styles.shareBtn} onClick={handleShare}>
            Share Result
          </button>
        </div>
      )}

      {canPlay && <Game puzzle={puzzle} onSolved={onPuzzleSolved} />}

      {!isOffline && <Leaderboard />}
      <Heatmap />
    </div>
  );
}

export default App;

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "Arial" },
  center: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f2f4f8" },
  card: { background: "white", padding: 40, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center" },
  loginBtn: { padding: "12px 24px", borderRadius: 8, border: "none", background: "#4285F4", color: "white", cursor: "pointer", marginTop: 20 },
  guestBtn: { padding: "10px 20px", background: "#555", color: "white", border: "none", borderRadius: 8, cursor: "pointer" },
  difficultyBtn: { padding: "8px 16px", borderRadius: 8, cursor: "pointer", margin: "0 5px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  logoutBtn: { padding: "8px 16px", background: "#e53935", color: "white", border: "none", borderRadius: 6, cursor: "pointer" },
  stats: { display: "flex", gap: 20, marginBottom: 20 },
  statBox: { flex: 1, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.08)", textAlign: "center" },
  lockBox: { background: "#fff3cd", padding: 30, borderRadius: 12, textAlign: "center", marginTop: 20 },
  timer: { fontSize: 28, fontWeight: "bold", marginTop: 10 },
  shareBtn: { marginTop: 20, padding: "12px 22px", background: "#4caf50", color: "white", border: "none", borderRadius: 8, cursor: "pointer" },
};
