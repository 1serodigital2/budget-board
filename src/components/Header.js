import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "../context/AuthContext";
const Header = () => {
    const { logOut } = useAuth();
    return (_jsxs("div", { className: "flex justify-between px-10 py-5 border-b", children: [_jsx("h1", { children: "Header" }), _jsx("button", { onClick: () => logOut(), className: "cursor-pointer", children: "Logout" })] }));
};
export default Header;
