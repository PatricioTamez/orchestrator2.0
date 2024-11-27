// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  connectDatabaseEmulator,
} from "firebase/database";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6FS4XYWisy5JZJ4TUo6hrEvXqb8zywUk",
  authDomain: "orchestrator-11943.firebaseapp.com",
  projectId: "orchestrator-11943",
  storageBucket: "orchestrator-11943.firebasestorage.app",
  messagingSenderId: "594418103934",
  appId: "1:594418103934:web:811019a8c9303f01600a2f",
  measurementId: "G-B5ER84FY8Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();

// Connect to emulators in development mode
if (import.meta.env.MODE === "development") {
  connectDatabaseEmulator(db, "localhost", 9000);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

// Function to save data to the Realtime Database
const saveToDatabase = async (path, data) => {
  try {
    const dbRef = ref(db, path); // Define the database path
    await set(dbRef, data); // Save data at the specified path
    console.log("Data saved successfully:", data);
  } catch (error) {
    console.error("Error saving data to the database:", error);
  }
};

// Function to push new data (creates unique IDs for each entry)
const pushToDatabase = async (path, data) => {
  try {
    const dbRef = ref(db, path); // Define the database path
    const newRef = push(dbRef); // Create a new unique reference
    await set(newRef, data); // Save data at the unique reference
    console.log("Data pushed successfully:", data);
  } catch (error) {
    console.error("Error pushing data to the database:", error);
  }
};

export {
  app,
  db,
  auth,
  storage,
  functions,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  saveToDatabase,
  pushToDatabase,
};
