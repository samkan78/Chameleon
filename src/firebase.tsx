import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyANLMeE364tcbnwSCVakUi3x7xjVqr6naU",
  authDomain: "chameleon-project-cbbff.firebaseapp.com",
  projectId: "chameleon-project-cbbff",
  storageBucket: "chameleon-project-cbbff.firebasestorage.app",
  messagingSenderId: "968775649824",
  appId: "1:968775649824:web:66a1d217f6632d1c430a45",
  measurementId: "G-0LEBFM5LFM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
