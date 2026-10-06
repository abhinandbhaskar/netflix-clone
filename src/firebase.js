import { initializeApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyC1Te79O6r6UKp9z0OEgMXspSKPVH6HCn0",
  authDomain: "new-netflix-cd3e9.firebaseapp.com",
  projectId: "new-netflix-cd3e9",
  storageBucket: "new-netflix-cd3e9.firebasestorage.app",
  messagingSenderId: "438254134735",
  appId: "1:438254134735:web:09f74afe6a9f971a751eba",
  measurementId: "G-B7FSDQDZ12"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    toast.success("Account created successfully! Welcome to the app!");
  } catch (error) {
    console.log(error);
    const msg = error.code ? error.code.split("/")[1]?.split("-").join(" ") : null;
    toast.error(msg || "An error occurred during signup.");
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully! Welcome back!");
  } catch (error) {
    console.error("Login Error:", error.code);
    const msg = error.code ? error.code.split("/")[1]?.split("-").join(" ") : null;
    toast.error(msg || "Invalid email or password.");
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
  } catch (error) {
    console.error("Logout Error:", error.code);
    const msg = error.code ? error.code.split("/")[1]?.split("-").join(" ") : null;
    toast.error(msg || "An error occurred during logout.");
  }
};

export { auth, db, login, signup, logout };
