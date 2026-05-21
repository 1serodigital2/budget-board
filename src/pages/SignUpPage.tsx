import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Input from "../components/Input";
import {
  HandleInputChangeProps,
  LoginProps,
  LoginTypes,
} from "../types/FormTypes";
import LoginSignup from "../components/form/LoginSignup";
import { HandleInputChangeType } from "../types/category";
import useSubmitMessage from "../hooks/useSubmitMessage";
import Alert from "../components/ui/Alert";

const initialValues: LoginProps = {
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
  const [loginData, setLoginData] = useState<LoginProps>(initialValues);

  const handleFormSubmit = async (e: React.SubmitEvent) => {
    try {
      e.preventDefault();
      const email = loginData.email || "";
      const password = loginData.password || "";
      if (!email || !password) {
        console.log("Please fill up the form properly");
      }
      await createUser({ email, password });
    } catch (error: any) {
      showSubmitMessage(error.message || "Unable to signup", "error");
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

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Budget Board Signup
      </h1>
      {submitMessage && submitMessage.message !== "" && (
        <Alert type={submitMessage.type} message={submitMessage.message} />
      )}
      {authError && <Alert type="error" message={authError} />}
      <LoginSignup
        handleFormSubmit={handleFormSubmit}
        loading={loading}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};
export default Signup;
