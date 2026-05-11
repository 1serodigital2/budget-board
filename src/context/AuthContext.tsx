import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

// auth

const AuthContext = createContext({
  toggleLoading: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const createUser = (email, password) => {
  //   setLoading(true);
  //   return createUserWithEmailAndPassword(auth, email, password);
  // };

  // const loginUser = (email, password) => {
  //   setLoading(true);
  //   console.log("login response ", response);
  //   return signInWithEmailAndPassword(auth, email, password);
  // };

  // const logOut = () => {
  //   setLoading(true);
  //   return signOut(auth);
  // };

  const toggleLoading = () => {
    setLoading(true);
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
    // loginUser,
    // logOut,
    // loading,
    toggleLoading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
