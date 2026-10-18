import { createContext, useContext } from "react";

// Keep the context identity in its own stable module. During Vite hot reload,
// replacing the provider module must not leave a mounted provider and its
// consumers using different Context instances.
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
