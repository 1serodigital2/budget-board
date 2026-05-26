import { jsx as _jsx } from "react/jsx-runtime";
const Submit = ({ isPending }) => {
    return (_jsx("button", { className: "bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer", children: isPending ? "Submitting" : "Submit" }));
};
export default Submit;
