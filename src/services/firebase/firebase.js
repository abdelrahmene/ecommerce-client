import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Configuration Firebase
// Utilisation de la même configuration que l'admin pour partager la même base de données
const firebaseConfig = {
  apiKey: "AIzaSyCSpl6NXWo1p00Za0aK0bAfnnzDVHEA7EI",
  authDomain: "ecommerce-website-ff1dd.firebaseapp.com",
  projectId: "ecommerce-website-ff1dd",
  storageBucket: "ecommerce-website-ff1dd.firebasestorage.app",
  messagingSenderId: "449173690511",
  appId: "1:449173690511:web:8966757adec59140aeb8fa",
  measurementId: "G-72E2XBVF79"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;