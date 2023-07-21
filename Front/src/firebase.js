import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0nKvvA5E2UYR8rXVuTdi9IJyvXkZMipo",
  authDomain: "chattripaftetthearmy.firebaseapp.com",
  projectId: "chattripaftetthearmy",
  storageBucket: "gs://chattripaftetthearmy.appspot.com",
  messagingSenderId: "246620328341",
  appId: "1:246620328341:web:e249e9477b30cbd303e69c",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//storage
const storage = getStorage(app);
export {db,storage}