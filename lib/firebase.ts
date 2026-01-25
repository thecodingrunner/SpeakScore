// lib/firebase.ts
// Firebase configuration - STORAGE ONLY (audio files)
// Database operations use MongoDB instead

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWRpCqUqdRGEqHhi7VEJXagUYd06Wu860",
  authDomain: "speakscore-d4482.firebaseapp.com",
  projectId: "speakscore-d4482",
  storageBucket: "speakscore-d4482.firebasestorage.app",
  messagingSenderId: "454254624866",
  appId: "1:454254624866:web:8f96819c8416c7d89dd13b",
  measurementId: "G-FD4WPC3G6V"
};

// Initialize Firebase (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize ONLY Storage (we use MongoDB for database)
const storage = getStorage(app);

// Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Export only storage and analytics (NO Firestore, NO Auth)
export { app, storage, analytics, firebaseConfig };