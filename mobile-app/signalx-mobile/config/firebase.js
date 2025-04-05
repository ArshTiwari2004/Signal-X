// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRNvoQ8S0Mx8Fr700gvc2PkyJuq_8KPzM",
  authDomain: "signalx-3d1fb.firebaseapp.com",
  projectId: "signalx-3d1fb",
  storageBucket: "signalx-3d1fb.firebasestorage.app",
  messagingSenderId: "131196942520",
  appId: "1:131196942520:web:7e567155fd692690961c4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)