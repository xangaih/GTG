// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBnTi5y430LrLdzdx5qM-RkcAHPd7TVtU",
  authDomain: "gatewaygold.firebaseapp.com",
  projectId: "gatewaygold",
  storageBucket: "gatewaygold.firebasestorage.app",
  messagingSenderId: "251923059112",
  appId: "1:251923059112:web:006a20ed69907ffb760d9d",
  measurementId: "G-7M6HSB8PYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { app, auth, db, functions }; 