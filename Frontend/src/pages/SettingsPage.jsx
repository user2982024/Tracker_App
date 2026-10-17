
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "A bright, clean interface with white surfaces.",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "A calm navy interface with slate surfaces and blue accents.",
    Icon: Moon,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-foreground">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-2 text-foreground-secondary">
          Customize your TaskFlow experience.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Choose the appearance used throughout TaskFlow.
          </p>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium">
            Theme
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {themeOptions.map(({ value, label, description, Icon }) => {
              const isSelected = theme === value;

              return (
                <label
                  key={value}
                  className={[
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
                    isSelected
                      ? "border-primary bg-surface-secondary"
                      : "border-border hover:bg-surface-secondary",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={isSelected}
                    onChange={() => setTheme(value)}
                    className="sr-only"
                  />

                  <span className="mt-0.5 rounded-lg bg-surface-secondary p-2">
                    <Icon size={20} aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      {label}
                      {isSelected && (
                        <span className="text-xs font-medium text-primary">
                          Selected
                        </span>
                      )}
                    </span>

                    <span className="mt-1 block text-sm text-foreground-secondary">
                      {description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>
    </div>
  );
};

export default SettingsPage;
