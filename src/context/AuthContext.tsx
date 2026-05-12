import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

// auth
import { loginUser, logOutUser } from "../services/auth";

const AuthContext = createContext({
  toggleLoading: () => {},
  user: null,
  logOut: () => {},
  login: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const createUser = (email, password) => {
  //   setLoading(true);
  //   return createUserWithEmailAndPassword(auth, email, password);
  // };

  const login = async (email, password) => {
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
