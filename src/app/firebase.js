// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAJF7cA1G_Rel3oMdMQ2cshhFSTppozn6M",
  authDomain: "sep490-3e78f.firebaseapp.com",
  projectId: "sep490-3e78f",
  storageBucket: "sep490-3e78f.firebasestorage.app",
  messagingSenderId: "756076170685",
  appId: "1:756076170685:web:c0de6ee303b5a12cdd56d4",
  measurementId: "G-XF4R6EHS0D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
