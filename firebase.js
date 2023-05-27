// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3xY9nyPrWDQAexAGt6kryZd3CiDacy9g",
  authDomain: "ask-scoe.firebaseapp.com",
  projectId: "ask-scoe",
  storageBucket: "ask-scoe.appspot.com",
  messagingSenderId: "376616658010",
  appId: "1:376616658010:web:6d3f4cec8909af9873e463",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(app);
export { app, db, storage };
export default { auth };
