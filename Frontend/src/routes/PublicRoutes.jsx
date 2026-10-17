import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/UI/Spinner";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner fullPage size={40} />;
  }

  // If logged in → go to app
  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
