// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoGhkad6_upQMNAka7dgkwEJGtBdEgeL0",
  authDomain: "shotter-sns.firebaseapp.com",
  projectId: "shotter-sns",
  storageBucket: "shotter-sns.firebasestorage.app",
  messagingSenderId: "823892458768",
  appId: "1:823892458768:web:f0ead9f41f408a03ca3995",
  measurementId: "G-YEYDSZD1V0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };