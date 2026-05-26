import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import Input from "../Input";
const LoginSignup = ({ handleFormSubmit, loading, handleInputChange, }) => {
    const location = useLocation();
    const slugEnd = location.pathname.split("/").filter(Boolean).pop();
    return (_jsx("div", { className: "bg-(--color-primary) p-5 rounded-3xl w-125", children: _jsxs("form", { onSubmit: handleFormSubmit, action: "", children: [_jsx("div", { className: "mb-2.5", children: _jsx(Input, { name: "email", label: "Email", handleInputChange: handleInputChange, required: true }) }), _jsx("div", { className: "mb-2.5", children: _jsx(Input, { name: "password", label: "Password", handleInputChange: handleInputChange, required: true }) }), _jsx("button", { className: "bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer", disabled: loading === true, children: loading ? "Submitting" : slugEnd === "login" ? "login" : "signup" })] }) }));
};
export default LoginSignup;
