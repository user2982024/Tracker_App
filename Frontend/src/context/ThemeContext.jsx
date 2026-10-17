
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "taskflow-theme";

const getInitialTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark"
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme switching still works for this session.
    }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside a ThemeProvider"
    );
  }

  return context;
};
