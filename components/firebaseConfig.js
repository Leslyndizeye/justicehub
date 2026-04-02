
// Fix: Corrected imports for Firebase v9+ modular SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDpDz84KcUvDbWvkPVZuWnFSH4pQeexf2k", // Note: process.env.API_KEY is used for Gemini, Firebase uses its own key
    authDomain: "ireme-593e4.firebaseapp.com",
    projectId: "ireme-593e4",
    storageBucket: "ireme-593e4.firebasestorage.app",
    messagingSenderId: "106729642508",
    appId: "1:106729642508:web:52bd213c634059e42aec29",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence)
  .catch((error) => console.error("Persistence error:", error));

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
