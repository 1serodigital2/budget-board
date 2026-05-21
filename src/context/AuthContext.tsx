import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../services/firebase";

// auth
import { loginUser, logOutUser } from "../services/auth";
import { LoginProps } from "../types/FormTypes";

// import { setUserIdCookie } from "../utils/helpers";

interface AuthContextType {
  user: User | null;
  logOut: () => Promise<void>;
  login: ({ email, password }: LoginProps) => Promise<void>;
  loading: boolean;
  authError?: string;
  resetAuthError: () => void;
  createUser: ({ email, password }: LoginProps) => Promise<void>;
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

  const login = async ({ email, password }: LoginProps) => {
    try {
      setLoading(true);
      await loginUser(email, password);
    } catch (error: any) {
      console.error("Critical error " + error);
      setAuthError(error.message || "Unable to login");
      setTimeout(() => {
        setAuthError("");
      }, 3000);
    } finally {
      setLoading(false);
      // setAuthError("");
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createUser = async ({ email, password }: LoginProps) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("User created:", user.uid);
      setLoading(false);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing up:", errorCode, errorMessage);
      setAuthError("Error signing up " + error);
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
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
