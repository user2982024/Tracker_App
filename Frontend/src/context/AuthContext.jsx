import { useState, useEffect, createContext, useContext } from "react";
import { signoutUser, getAuthenticatedUser } from "../services/authServices";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getAuthenticatedUser();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout
  const logout = async () => {
    try {
      await signoutUser();
    } catch (error) {
      console.error("Logout failed:", error.message);
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