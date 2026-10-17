
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
            background: isDark ? "#111a2b" : "#ffffff",
            color: isDark ? "#e9eef8" : "#0f172a",
            border: `1px solid ${isDark ? "#253149" : "#e2e8f0"}`,
          },
        }}
      />
      <AppRoutes />
    </>
  );
};

export default App;
