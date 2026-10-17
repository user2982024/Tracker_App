
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? "#151f30" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#0f172a",
            border: `1px solid ${isDark ? "#2b3a50" : "#e2e8f0"}`,
          },
        }}
      />
      <AppRoutes />
    </>
  );
};

export default App;
