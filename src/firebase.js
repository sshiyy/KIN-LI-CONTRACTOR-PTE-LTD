import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9iQ3st6icLLzMYLHH27X3_645iU_A-hM",
  authDomain: "kin-li.firebaseapp.com",
  projectId: "kin-li",
  storageBucket: "kin-li.firebasestorage.app",
  messagingSenderId: "1095936027132",
  appId: "1:1095936027132:web:eeb51471aefa8f3348aa79",
  measurementId: "G-7RZM2PNEKC"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;