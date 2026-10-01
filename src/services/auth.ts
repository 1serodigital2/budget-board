import { supabase } from "./supabase";

export const signUpWithEmail = (email: string, password: string) =>
  supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });

export const signInWithEmail = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOutUser = () => supabase.auth.signOut();
