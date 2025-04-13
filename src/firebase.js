// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz4fOgJG_APp882rfaK1Xu--UT1i4Z7nw",
  authDomain: "technewz-9d6ee.firebaseapp.com",
  projectId: "technewz-9d6ee",
  storageBucket: "technewz-9d6ee.firebasestorage.app",
  messagingSenderId: "54529208568",
  appId: "1:54529208568:web:5246fea4cc0ed06b72cb0d",
  measurementId: "G-VHE3B3VL1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// ✅ This is the line you were missing
export const auth = getAuth(app);
