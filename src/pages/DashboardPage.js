import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "../context/AuthContext";
const Dashboard = () => {
    const { user } = useAuth();
    return _jsx("h1", { children: "Dashboard" });
};
export default Dashboard;
