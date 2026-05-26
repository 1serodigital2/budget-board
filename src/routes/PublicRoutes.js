import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
const PublicRoutes = () => {
    const { user } = useAuth();
    if (user) {
        return _jsx(Navigate, { to: "/" });
    }
    else {
        console.log("user is not logged in ");
        return _jsx(Outlet, {});
    }
};
export default PublicRoutes;
