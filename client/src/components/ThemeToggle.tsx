import { useTheme } from "@hooks/useTheme";
import "./ThemeToggle.scss";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="toggle-theme"
      onClick={toggleTheme}
      aria-label="toggle theme"
    >
      {theme === "light" ? "☀️" : "🌑"}
    </button>
  );
}
