import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkylPPYwRXZcfVQbMld4dHmbaGmT2ut7Y",
  authDomain: "puzzle-game-aea98.firebaseapp.com",
  projectId: "puzzle-game-aea98",
  storageBucket: "puzzle-game-aea98.firebasestorage.app",
  messagingSenderId: "304406651767",
  appId: "1:304406651767:web:deb2e4cb550dc04425f772"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();