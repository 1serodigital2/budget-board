import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../services/firebase";

// auth
import { loginUser, logOutUser } from "../services/auth";
import { LoginProps } from "../types/FormTypes";

interface AuthContextType {
  user: User | null;
  logOut: () => Promise<void>;
  login: ({ email, password }: LoginProps) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logOut: async () => {},
  login: async () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async ({ email, password }: LoginProps) => {
    try {
      setLoading(true);
      await loginUser(email, password);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    // createUser,
    user,
    login,
    logOut,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
