import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PublicRoutes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("user is logged in ");
      // navigate("/");
      <Navigate to="/" />;
    } else {
      console.log("user is not logged in ");
    }
  }, [user]);

  return <Outlet />;
};

export default PublicRoutes;
