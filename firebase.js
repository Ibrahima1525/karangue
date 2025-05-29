import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-5zOo69eR4CMABWrrbxpWB_TrfuEQESQ",
  authDomain: "karangueapp.firebaseapp.com",
  projectId: "karangueapp",
  storageBucket: "karangueapp.appspot.com",
  messagingSenderId: "69537892885",
  appId: "1:69537892885:web:d96d73b3432e9c6a5c1c1c",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db, firebaseConfig }; // ✅ Ajout firebaseConfig ici
