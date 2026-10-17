import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/UI/Spinner";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // WAIT FIRST
  if (loading) {
    return <Spinner fullPage size={40} />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
