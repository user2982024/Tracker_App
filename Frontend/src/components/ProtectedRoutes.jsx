import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Check if token exists/ user is authenticated
    const isAuthenticated = !!localStorage.getItem("token");

    // If logged in allow access, if not redirect to signin
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace/>
}

export default ProtectedRoute;