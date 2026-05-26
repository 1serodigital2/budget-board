import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Alert from "../ui/Alert";
import Input from "../Input";
import Submit from "./Submit";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import useSubmitMessage from "../../hooks/useSubmitMessage";
import Select from "./Select";
const ExpenseForm = ({ handleFormSubmit, handleInputChange, inputValues, isPending, submitMessage, }) => {
    const { user } = useAuth();
    const { showSubmitMessage } = useSubmitMessage();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            if (!user?.uid) {
                showSubmitMessage("Unauthorized access", "error");
                return;
            }
            return getCategories(user.uid);
        },
    });
    return (_jsxs(_Fragment, { children: [submitMessage && submitMessage.message !== "" && (_jsx(Alert, { type: submitMessage.type, message: submitMessage.message })), _jsxs("form", { onSubmit: handleFormSubmit, className: "bg-(--color-primary) p-8 rounded-3xl max-w-3xl", children: [_jsx("div", { className: "mb-2 5", children: _jsx(Input, { type: "number", name: "amount", label: "Amount", required: true, handleInputChange: handleInputChange, inputValues: inputValues.amount || "" }) }), _jsx("div", { className: "mb-2 5", children: _jsx(Select, { getOptionValue: (category) => category.id, getOptionLabel: (category) => category.name, name: "category", data: data || [], label: "Category", required: true, handleInputChange: handleInputChange, inputValues: inputValues.category || "" }) }), _jsx("div", { className: "mb-2 5", children: _jsx(Input, { name: "note", label: "Short note", handleInputChange: handleInputChange, inputValues: inputValues.note || "" }) }), _jsx(Submit, { isPending: isPending })] })] }));
};
export default ExpenseForm;
