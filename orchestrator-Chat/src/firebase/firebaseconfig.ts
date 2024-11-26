// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator, signInWithPopup } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
import { connectDatabaseEmulator, getDatabase } from "firebase/database";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6FS4XYWisy5JZJ4TUo6hrEvXqb8zywUk",
  authDomain: "orchestrator-11943.firebaseapp.com",
  projectId: "orchestrator-11943",
  storageBucket: "orchestrator-11943.firebasestorage.app",
  messagingSenderId: "594418103934",
  appId: "1:594418103934:web:811019a8c9303f01600a2f",
  measurementId: "G-B5ER84FY8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const dab = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();


if (import.meta.env.MODE === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectDatabaseEmulator(dab, "localhost", 9000 );
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export { 
  db, 
  auth, 
  storage,
  app,
  functions, 
  googleProvider,
  dab,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, };