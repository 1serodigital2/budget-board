import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBarNavigation from "../components/SidebarNavigations";
const RootLayout = () => {
    return (_jsxs("div", { className: "flex", children: [_jsx(SideBarNavigation, {}), _jsxs("main", { className: "w-full", children: [_jsx(Header, {}), _jsx("div", { className: "px-10 py-5", children: _jsx(Outlet, {}) })] })] }));
};
export default RootLayout;
