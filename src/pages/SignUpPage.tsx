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

const initialValues: LoginProps = {
  email: "",
  password: "",
};

const Signup = () => {
  const { user, loading, createUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const [loginData, setLoginData] = useState<LoginProps>(initialValues);

  const handleFormSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const email = loginData.email || "";
    const password = loginData.password || "";
    if (!email || !password) {
      console.log("Please fill up the form properly");
    }
    await createUser({ email, password });
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
      <LoginSignup
        handleFormSubmit={handleFormSubmit}
        loading={loading}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};
export default Signup;
