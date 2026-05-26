import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginSignup from "../components/form/LoginSignup";
import useSubmitMessage from "../hooks/useSubmitMessage";
import Alert from "../components/ui/Alert";
const initialValues = {
    email: "",
    password: "",
};
const Signup = () => {
    const { submitMessage, showSubmitMessage } = useSubmitMessage();
    const { user, loading, createUser, authError } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);
    const [loginData, setLoginData] = useState(initialValues);
    const handleFormSubmit = async (e) => {
        try {
            e.preventDefault();
            const email = loginData.email || "";
            const password = loginData.password || "";
            if (!email || !password) {
                console.log("Please fill up the form properly");
            }
            await createUser({ email, password });
        }
        catch (error) {
            showSubmitMessage(error.message || "Unable to signup", "error");
        }
    };
    const handleInputChange = ({ name, inputValue }) => {
        setLoginData((prevState) => {
            return {
                ...prevState,
                [name]: inputValue,
            };
        });
    };
    return (_jsxs("div", { className: "flex min-h-screen items-center justify-center flex-col", children: [_jsx("h1", { className: "mb-2 text-center text-3xl font-bold", children: "Budget Board Signup" }), submitMessage && submitMessage.message !== "" && (_jsx(Alert, { type: submitMessage.type, message: submitMessage.message })), authError && _jsx(Alert, { type: "error", message: authError }), _jsx(LoginSignup, { handleFormSubmit: handleFormSubmit, loading: loading, handleInputChange: handleInputChange })] }));
};
export default Signup;
