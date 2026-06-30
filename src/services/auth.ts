import { supabase } from "./supabase";
import { LoginProps } from "../types/FormTypes";

export const createUser = ({ email, password }: LoginProps) => {
  return supabase.auth.signUp({ email, password });
};

export const loginUser = (email: string, password: string) => {
  console.log("login response");
  return supabase.auth.signInWithPassword({ email, password });
};

export const logOutUser = () => {
  return supabase.auth.signOut();
};
