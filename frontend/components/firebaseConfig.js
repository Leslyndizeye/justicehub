
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBqCMuUq5Q3uWzIUt7mdy0pcIn_lYSVD08",
    authDomain: "ireme-30164.firebaseapp.com",
    databaseURL: "https://ireme-30164-default-rtdb.firebaseio.com",
    projectId: "ireme-30164",
    storageBucket: "ireme-30164.firebasestorage.app",
    messagingSenderId: "106729642508",
    appId: "1:106729642508:web:bcb01a7555d9afe22aec29",
    measurementId: "G-GZPQBCQTQT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence)
  .catch((error) => console.error("Persistence error:", error));

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
