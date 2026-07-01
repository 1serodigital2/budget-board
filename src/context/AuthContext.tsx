import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

// auth
import {
  loginUser,
  logOutUser,
  createUser as createUserService,
} from "../services/auth";
import { LoginProps } from "../types/FormTypes";
import { createDefaultCategories } from "../api/category";

interface AuthContextType {
  user: User | null;
  logOut: () => Promise<void>;
  login: ({ email, password }: LoginProps) => Promise<void>;
  loading: boolean;
  authError?: string;
  resetAuthError: () => void;
  createUser: ({ email, password }: LoginProps) => Promise<void>;
  authSuccess?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logOut: async () => {},
  login: async () => {},
  loading: true,
  resetAuthError: () => {},
  createUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState<string>("");

  const login = async ({ email, password }: LoginProps) => {
    try {
      setLoading(true);
      const { error } = await loginUser(email, password);
      if (error) throw error;
    } catch (error: any) {
      console.error("Critical error " + error);
      setAuthError(error.message || "Unable to login");
      setTimeout(() => {
        setAuthError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setLoading(true);
      await logOutUser();
    } finally {
      console.log("user logged out");
      setLoading(false);
    }
  };
  const resetAuthError = () => {
    setAuthError("");
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createUser = async ({ email, password }: LoginProps) => {
    try {
      setLoading(true);
      const { data, error } = await createUserService({ email, password });

      if (error) throw error;

      const user = data.user;

      if (user?.confirmation_sent_at && !user?.user_metadata?.email_verified) {
      }
      console.log("[createUser] user", user);

      if (user?.id) {
        await createDefaultCategories(user.id);
      }

      setAuthSuccess(
        "Account created successfully! Please check your email and click the verification link before signing in.",
      );
      console.log("User created:", user?.id);
      setLoading(false);
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      setAuthError("Error signing up " + error.message);
      setTimeout(() => {
        setAuthError("");
      }, 5000);
      setLoading(false);
    }
  };

  const authValue = {
    createUser,
    user,
    login,
    logOut,
    loading,
    authError,
    resetAuthError,
    authSuccess,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
