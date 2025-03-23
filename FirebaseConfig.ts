// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const analytics = getAnalytics(FirebaseApp);
export const FirebaseFirestore = getFirestore(FirebaseApp);
