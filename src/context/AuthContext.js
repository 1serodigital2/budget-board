import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, } from "firebase/auth";
import { auth } from "../services/firebase";
// auth
import { loginUser, logOutUser } from "../services/auth";
import { createDefaultCategories } from "../api/category";
const AuthContext = createContext({
    user: null,
    logOut: async () => { },
    login: async () => { },
    loading: true,
    resetAuthError: () => { },
    createUser: async () => { },
});
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState("");
    const login = async ({ email, password }) => {
        try {
            setLoading(true);
            await loginUser(email, password);
        }
        catch (error) {
            console.error("Critical error " + error);
            setAuthError(error.message || "Unable to login");
            setTimeout(() => {
                setAuthError("");
            }, 3000);
        }
        finally {
            setLoading(false);
            // setAuthError("");
        }
    };
    const logOut = async () => {
        try {
            setLoading(true);
            await logOutUser();
        }
        finally {
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
    const createUser = async ({ email, password }) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user.uid) {
                createDefaultCategories(user.uid);
            }
            console.log("User created:", user.uid);
            setLoading(false);
        }
        catch (error) {
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
    return (_jsx(AuthContext.Provider, { value: authValue, children: children }));
};
export const useAuth = () => useContext(AuthContext);
