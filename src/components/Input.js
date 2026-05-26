import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Input = ({ name, label = "", handleInputChange, required = false, type = "text", inputValues, sx = "", placeholder = "", }) => {
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { htmlFor: name, className: "block mb-2.5 text-md text-white font-medium text-heading", children: label }), _jsx("input", { type: type, id: name, required: required, className: `block mb-2.5 text-sm font-medium text-heading p-3 border rounded-xl ${sx ? sx : "text-white"}`, onChange: (e) => handleInputChange({ name, inputValue: e.target.value }), value: inputValues, placeholder: placeholder })] }));
};
export default Input;
