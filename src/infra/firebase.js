// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9StFEM0UfqR8efqa5wNQYqMpVuw8avIs",
  authDomain: "react-94cca.firebaseapp.com",
  projectId: "react-94cca",
  storageBucket: "react-94cca.appspot.com",
  messagingSenderId: "679581021990",
  appId: "1:679581021990:web:fc1a5017a6a32d0706b3e7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);