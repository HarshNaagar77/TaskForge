import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC72N3qyEslIfwpToMRG_na0vJc-7QC6FE",
    authDomain: "taskforge-641b4.firebaseapp.com",
    projectId: "taskforge-641b4",
    appId: "1:353208027256:web:ebb3e5d6314194c3b0c58d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
