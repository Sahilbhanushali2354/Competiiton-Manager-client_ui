// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSo-gHqKccDWJpCRIMx6WCEUqBrjujNLM",
  authDomain: "user-management-d1f7a.firebaseapp.com",
  databaseURL: "https://user-management-d1f7a-default-rtdb.firebaseio.com",
  projectId: "user-management-d1f7a",
  storageBucket: "user-management-d1f7a.appspot.com",
  messagingSenderId: "768544187257",
  appId: "1:768544187257:web:ac49df56aafc0f51f385a8",
  measurementId: "G-KSCGP523G5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const FStore = getFirestore(app);
export const auth = getAuth(app);

// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// const firebaseConfig = {
//   apiKey: "AIzaSyA3csnwLHlc1hO6Q2WCUOLtNs-_TnNmVBs",
//   authDomain: "competition-manager-3fa76.firebaseapp.com",
//   projectId: "competition-manager-3fa76",
//   storageBucket: "competition-manager-3fa76.appspot.com",
//   messagingSenderId: "854477779480",
//   appId: "1:854477779480:web:d679ba1dc1c029af3e496d",
//   measurementId: "G-XWC61JX743",
// };
// const app = initializeApp(firebaseConfig);
// export const FStore = getFirestore(app);
// export const auth = getAuth(app);
