import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { updatePreferences } from "../services/settingsService";

const ThemeContext = createContext(null);
const STORAGE_KEY = "taskflow-theme";

const getInitialTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const ThemeProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [localTheme, setLocalTheme] = useState(getInitialTheme);
  const theme = user?.preferences?.theme || localTheme;

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The active theme still applies for this session.
    }
  }, [theme]);

  const setTheme = useCallback(async (nextTheme) => {
    if (!["light", "dark"].includes(nextTheme)) return;

    if (!user) {
      setLocalTheme(nextTheme);
      return;
    }

    const previousTheme = user.preferences?.theme || localTheme;
    setUser((currentUser) => ({
      ...currentUser,
      preferences: { ...currentUser.preferences, theme: nextTheme },
    }));

    try {
      const result = await updatePreferences({ theme: nextTheme });
      setUser(result.user);
    } catch (error) {
      setUser((currentUser) => ({
        ...currentUser,
        preferences: { ...currentUser.preferences, theme: previousTheme },
      }));
      toast.error(error.message || "Unable to save theme preference");
    }
  }, [localTheme, setUser, user]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside a ThemeProvider");
  return context;
};
