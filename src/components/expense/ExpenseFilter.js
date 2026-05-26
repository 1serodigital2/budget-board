import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Select from "../form/Select";
import Submit from "../form/Submit";
const ExpenseFilter = ({ catData, handleInputChange, handleFilterSubmit, filter, }) => {
    return (_jsx("form", { onSubmit: handleFilterSubmit, className: "mb-3", children: _jsxs("div", { className: "flex", children: [_jsx(Select, { getOptionValue: (category) => category?.id, getOptionLabel: (category) => category?.name, name: "category", data: Array.isArray(catData) ? catData : catData ? [catData] : [], label: "Category", handleInputChange: handleInputChange, inputValues: filter.category || "" }), _jsx(Submit, {})] }) }));
};
export default ExpenseFilter;
