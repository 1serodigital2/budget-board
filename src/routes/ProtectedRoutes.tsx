import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoutes;
