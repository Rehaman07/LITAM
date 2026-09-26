import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIS2_MBtHDd6NLPpGpfW6C2-4I6TcDF9w",
  authDomain: "litam-a3b33.firebaseapp.com",
  projectId: "litam-a3b33",
  storageBucket: "litam-a3b33.firebasestorage.app",
  messagingSenderId: "602893090532",
  appId: "1:602893090532:web:81e23d074bd4538e8576f1",
  measurementId: "G-2KZQFCRR73"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
