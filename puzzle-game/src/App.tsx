import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import type { User } from "firebase/auth";

import { auth, provider } from "./firebase.js";


function App() {
  const [user, setUser] = useState<User | null>(null);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Puzzle Game</h1>

      {user ? (
        <div className="text-center">
          <img
            src={user.photoURL || ""}
            className="w-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl">Welcome {user.displayName}</h2>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}

export default App;
