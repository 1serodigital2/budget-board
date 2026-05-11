import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

export const createUser = (email, password) => {
  setLoading(true);
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  setLoading(true);
  console.log("login response ", response);
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  setLoading(true);
  return signOut(auth);
};
