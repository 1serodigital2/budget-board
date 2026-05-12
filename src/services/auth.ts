import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export const createUser = (email, password) => {
  setLoading(true);
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  console.log("login response ");
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOutUser = () => {
  return signOut(auth);
};
