import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6CYI7-tXLZyzywGhQi_NNhU3U6l8Bhhk",
  authDomain: "quilog-b7615.firebaseapp.com",
  projectId: "quilog-b7615",
  storageBucket: "quilog-b7615.appspot.com",
  messagingSenderId: "465147033343",
  appId: "1:465147033343:web:a475066bf6328608583eca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();