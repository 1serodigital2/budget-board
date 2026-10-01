import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { queryClient, supabase } from "../services/supabase";
import {
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from "../services/auth";

interface SignUpResult {
  /** True when the project requires email confirmation before sign-in. */
  needsConfirmation: boolean;
}

interface AuthContextType {
  user: User | null;
  /** True only while the initial session is being restored. */
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        currentUserId.current = session?.user.id ?? null;
        setUser(session?.user ?? null);
      })
      .catch((error) => console.error("Unable to restore session", error))
      .finally(() => setInitializing(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;
      // Drop cached data when the signed-in account changes.
      if (currentUserId.current !== (next?.id ?? null)) {
        currentUserId.current = next?.id ?? null;
        queryClient.clear();
      }
      setUser(next);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      initializing,
      signIn: async (email, password) => {
        const { error } = await signInWithEmail(email.trim(), password);
        if (error) throw error;
      },
      signUp: async (email, password) => {
        const { data, error } = await signUpWithEmail(email.trim(), password);
        if (error) throw error;
        // Supabase hides whether an address is registered; an existing
        // account comes back as a user with no identities.
        if (data.user && data.user.identities?.length === 0) {
          throw new Error("An account with this email already exists. Try signing in.");
        }
        return { needsConfirmation: !data.session };
      },
      signOut: async () => {
        await signOutUser();
        queryClient.clear();
      },
    }),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};

/** The signed-in user's id. Only use below <ProtectedRoutes>. */
export const useUserId = () => {
  const { user } = useAuth();
  if (!user) throw new Error("useUserId requires a signed-in user");
  return user.id;
};
