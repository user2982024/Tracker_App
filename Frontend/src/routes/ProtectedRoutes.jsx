import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthenticatedUser } from "../services/authServices";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getAuthenticatedUser();
                setIsAuthenticated(true);
            }
            catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // while checking authentication
    if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

    // Not authenticated -> redirect
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace/>
    }

    // Authenticated -> allow access
    return <Outlet />
}

export default ProtectedRoutes;