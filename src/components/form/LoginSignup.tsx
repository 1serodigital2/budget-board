import { useLocation } from "react-router-dom";

import { LoginFormType } from "../../types/loginSignup";
import Input from "../Input";

const LoginSignup = ({
  handleFormSubmit,
  loading,
  handleInputChange,
}: LoginFormType) => {
  const location = useLocation();

  const slugEnd = location.pathname.split("/").filter(Boolean).pop();

  return (
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
        <button
          className="bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer"
          disabled={loading === true}
        >
          {loading ? "Submitting" : slugEnd === "login" ? "login" : "signup"}
        </button>
      </form>
    </div>
  );
};

export default LoginSignup;
