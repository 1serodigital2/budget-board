import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Select = ({ name, label, getOptionValue, getOptionLabel, data, sx = "", required = false, handleInputChange, inputValues = "", }) => {
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { htmlFor: name, className: "block mb-2.5 text-md text-white font-medium text-heading", children: label }), _jsxs("select", { name: name, id: "", className: `block mb-2.5 text-sm font-medium text-heading p-3 border rounded-xl ${sx ? sx : ""}`, required: required, value: inputValues, onChange: (e) => handleInputChange({ name, inputValue: e.target.value }), children: [_jsx("option", { value: "", children: "Please select category" }), data &&
                        data?.map((item) => {
                            return (_jsx("option", { value: getOptionValue(item), children: getOptionLabel(item) || "null" }, getOptionValue(item)));
                        })] })] }));
};
export default Select;
