import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContextValue";

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
        "group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 text-foreground shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:scale-105 hover:bg-surface-secondary hover:text-primary hover:shadow-md hover:ring-2 hover:ring-primary/20 active:translate-y-0 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      ].join(" ")}
    >
      {isDark ? (
        <Sun size={18} className="transition-transform duration-200 group-hover:rotate-12" aria-hidden="true" />
      ) : (
        <Moon size={18} className="transition-transform duration-200 group-hover:-rotate-12" aria-hidden="true" />
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
