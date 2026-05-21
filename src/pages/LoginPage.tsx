import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Input from "../components/Input";
import { LoginProps, LoginTypes } from "../types/FormTypes";
import LoginSignup from "../components/form/LoginSignup";
import useSubmitMessage from "../hooks/useSubmitMessage";
import Alert from "../components/ui/Alert";
import { HandleInputChangeType } from "../types/category";

const initialValues: LoginProps = {
  email: "",
  password: "",
};

const Login = () => {
  const { submitMessage, showSubmitMessage } = useSubmitMessage();
  const { user, login, loading, authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("user data", user);
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [loginData, setLoginData] = useState<LoginProps>(initialValues);

  const handleFormSubmit = async (e: React.SubmitEvent) => {
    try {
      e.preventDefault();
      const email = loginData.email || "";
      const password = loginData.password || "";
      if (!email || !password) {
        console.log("Please fill up the form properly");
      }
      await login({ email, password });
    } catch (error) {
      showSubmitMessage("Unable to login " + error);
    }
  };

  const handleInputChange = ({ name, inputValue }: HandleInputChangeType) => {
    setLoginData((prevState) => {
      return {
        ...prevState,
        [name]: inputValue,
      };
    });
  };

  console.log("auth error", authError);

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}
      {authError && <Alert type="error" message={authError} />}
      <h1 className="mb-2 text-center text-3xl font-bold">Budget Board Login</h1>
      <LoginSignup
        handleFormSubmit={handleFormSubmit}
        loading={loading}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};
export default Login;
