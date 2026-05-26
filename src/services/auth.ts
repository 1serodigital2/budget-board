import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { LoginProps } from "../types/FormTypes";

export const createUser = ({ email, password }: LoginProps) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string) => {
  console.log("login response ");
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOutUser = () => {
  return signOut(auth);
};
