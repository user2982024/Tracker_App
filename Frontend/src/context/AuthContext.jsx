import { useState, useEffect, createContext, useContext } from "react";

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check auth on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Not authenticated");
                }

                const data = await res.json();

                setUser(data.user);
            }
            catch (error) {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Logout handler
    const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}