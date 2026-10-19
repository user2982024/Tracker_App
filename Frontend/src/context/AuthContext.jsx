import { useState, useEffect, useRef } from "react";
import { signoutUser, getAuthenticatedUser } from "../services/authServices";
import { AuthContext } from "./AuthContextValue";

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth } from "./AuthContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authCheckStarted = useRef(false);

  // Check auth on app load
  useEffect(() => {
    if (authCheckStarted.current) return;
    authCheckStarted.current = true;

    const checkAuth = async () => {
      try {
        const data = await getAuthenticatedUser();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("taskflow:session-expired", handleExpiredSession);
    return () => {
      window.removeEventListener("taskflow:session-expired", handleExpiredSession);
    };
  }, []);

  // Logout
  const logout = async () => {
    try {
      await signoutUser();
    } catch {
      // Clear local auth state even if the service is temporarily unavailable.
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
