import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-foreground-muted">Loading ...</div>
    ); 
  }

  // If logged in → go to app
  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;