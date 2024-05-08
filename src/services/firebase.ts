import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import firebaseConfig from "../firebaseConfig";

initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestore = getFirestore();
export const functions = getFunctions();

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFunctionsEmulator(functions, "localhost", 5001);
}
