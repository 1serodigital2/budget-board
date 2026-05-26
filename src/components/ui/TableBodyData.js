import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const TableBodyData = ({ item, children }) => {
    return (_jsxs(_Fragment, { children: [!children && _jsx("td", { className: "px-6 py-4", children: item }), children && _jsx("td", { className: "px-6 py-4", children: children })] }));
};
export default TableBodyData;
