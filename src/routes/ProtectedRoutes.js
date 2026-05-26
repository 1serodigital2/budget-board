import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoutes = () => {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/login" });
    }
    else {
        return _jsx(Outlet, {});
    }
};
export default ProtectedRoutes;
