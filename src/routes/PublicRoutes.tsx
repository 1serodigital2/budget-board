import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PublicRoutes = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  } else {
    console.log("user is not logged in ");
    return <Outlet />;
  }
};

export default PublicRoutes;
