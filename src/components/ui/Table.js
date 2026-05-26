import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Table = ({ columnNames, data, children }) => {
    console.log("data", data);
    return (_jsx("div", { className: "relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default rounded", children: _jsxs("table", { className: "w-full text-sm text-left rtl:text-right text-body", children: [_jsx("thead", { className: "text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default rounded", children: _jsx("tr", { children: columnNames.map((column) => (_jsx("th", { className: "px-6 py-3 font-medium", children: column }))) }) }), _jsx("tbody", { children: children })] }) }));
};
export default Table;
