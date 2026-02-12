import { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { saveProgress, getProgress } from "./storage";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  // Detect login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const data = await getProgress(u.uid);
        if (data) {
          setLevel(data.level);
          setScore(data.score);
        }
      }
    });

    return () => unsub();
  }, []);

  // Google Login
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setLevel(1);
    setScore(0);
  };

  // Simulate level complete
  const completeLevel = async () => {
    if (!user) return;

    const newLevel = level + 1;
    const newScore = score + 10;

    setLevel(newLevel);
    setScore(newScore);

    await saveProgress(user.uid, newLevel, newScore);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Puzzle Game</h1>

      {!user ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <>
          <h3>Welcome {user.displayName}</h3>
          <h2>Level: {level}</h2>
          <h2>Score: {score}</h2>

          <button onClick={completeLevel}>Complete Level</button>
          <br /><br />
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;
