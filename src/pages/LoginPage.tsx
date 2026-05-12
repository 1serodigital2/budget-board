import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Input from "../components/Input";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  if (user) {
    navigate("/");
  }
  const [loginData, setLoginData] = useState<InputProps>(initialValues);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const email = loginData.email || "";
    const password = loginData.password || "";
    if (!email || !password) {
      console.log("Please fill up the form properly");
    }
    await login(email, password);
  };

  const handleInputChange = (name, value) => {
    setLoginData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <h1 className="mb-2 text-center text-3xl font-bold">Budget Board</h1>
      <div className="bg-(--color-primary) p-5 rounded-3xl w-125">
        <form onSubmit={handleFormSubmit} action="">
          <div className="mb-2.5">
            <Input
              name="email"
              label="Email"
              handleInputChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-2.5">
            <Input
              name="password"
              label="Password"
              handleInputChange={handleInputChange}
              required
            />
          </div>
          <button className="bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer">
            {loading ? "Submitting" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
