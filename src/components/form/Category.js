import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Input from "../Input";
import Alert from "../ui/Alert";
import Submit from "./Submit";
const Category = ({ isPending, submitMessage, handleSubmit, handleInputChange, inputValues, }) => {
    return (_jsxs(_Fragment, { children: [submitMessage && submitMessage.message !== "" && (_jsx(Alert, { message: submitMessage.message, type: submitMessage.type })), _jsxs("form", { onSubmit: handleSubmit, className: "bg-(--color-primary) p-8 rounded-3xl max-w-3xl", children: [_jsx("div", { className: "mb-2", children: _jsx(Input, { name: "category", label: "Category", handleInputChange: handleInputChange, inputValues: inputValues.category || "" }) }), _jsx("div", { className: "flex justify-between", children: _jsx("div", { className: "mb-2 flex-1", children: _jsx(Input, { type: "color", name: "color", label: "Color", sx: "p-0 h-20 w-20", handleInputChange: handleInputChange, inputValues: inputValues.color || "" }) }) }), _jsx(Submit, { isPending: isPending })] })] }));
};
export default Category;
