// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVMY78KnjZ_GLLiTfv9eaErkZDk0y3ykY",
  authDomain: "lab2-itd112.firebaseapp.com",
  projectId: "lab2-itd112",
  storageBucket: "lab2-itd112.firebasestorage.app",
  messagingSenderId: "795044086392",
  appId: "1:795044086392:web:9d5c9a0a5e11acad05e38d",
  measurementId: "G-JJJN98BV6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);  // This line adds Firestore to your project

// Export the db object to use in your components
export { db, analytics };
