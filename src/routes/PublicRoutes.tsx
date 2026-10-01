import { Navigate, Outlet, useLocation, type Location } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    // Send the user back to the page they originally asked for.
    const from = (location.state as { from?: Location } | null)?.from;
    const target = from ? `${from.pathname}${from.search}` : "/";
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
};

export default PublicRoutes;
