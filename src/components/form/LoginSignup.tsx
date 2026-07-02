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
    <div className="bg-white border p-5 rounded-lg w-[80%] md:w-125">
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
            type="password"
            name="password"
            label="Password"
            handleInputChange={handleInputChange}
            required
          />
        </div>
        <button
          className="bg-(--color-primary) px-3 py-2 text-white rounded-lg cursor-pointer w-full"
          disabled={loading === true}
        >
          {loading ? "Submitting" : slugEnd === "login" ? "login" : "signup"}
        </button>
      </form>
    </div>
  );
};

export default LoginSignup;
