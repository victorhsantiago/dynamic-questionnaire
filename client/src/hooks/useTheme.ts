import { Theme } from "@models/theme";
import { createContext, useContext } from "react";

interface ThemeContextValues {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValues>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
