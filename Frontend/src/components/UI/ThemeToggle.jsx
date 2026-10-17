import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ className = "", showLabel = false }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const label = `Switch to ${isDark ? "light" : "dark"} theme`;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 text-foreground shadow-sm transition-all duration-200",
        "hover:bg-surface-secondary hover:text-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      ].join(" ")}
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}

      {showLabel && (
        <span className="hidden text-sm font-medium sm:inline">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
