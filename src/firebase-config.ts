
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Lưu ý: Người dùng cần thay thế các thông tin này bằng config từ Firebase Console của họ
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm8RVziRuwH1pGjruM-0zwQ6TanzkXv44",
  authDomain: "tramsacmini.firebaseapp.com",
  projectId: "tramsacmini",
  storageBucket: "tramsacmini.firebasestorage.app",
  messagingSenderId: "846071648559",
  appId: "1:846071648559:web:77e9e8b62285dfd21711da",
  measurementId: "G-1WV8P95RWN"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
