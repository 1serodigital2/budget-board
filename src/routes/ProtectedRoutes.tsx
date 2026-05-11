import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      <Navigate to="/" />;
    } else {
      <Navigate to="/login" />;
    }
  }, []);

  return <Outlet />;
};

export default ProtectedRoutes;
