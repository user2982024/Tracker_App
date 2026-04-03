import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  // Wait for auth check
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // If already logged in → go to app
  if (user) {
    return <Navigate to="/app" replace />;
  }

  // Not logged in → allow access
  return <Outlet />;
};

export default PublicRoute;