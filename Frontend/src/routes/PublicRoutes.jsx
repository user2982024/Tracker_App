import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  // AIT — do not render anything yet
  if (loading) {
    return null; // or loader
  }

  // If logged in → go to app
  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;