import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="icon-button"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}