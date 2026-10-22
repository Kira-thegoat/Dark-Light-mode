import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "site-theme";

export function parseTheme(value: string | null): Theme {
  return value === "dark" ? "dark" : "light";
}

type ThemeContextValue = {
  theme: Theme;
  ready: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: Theme = "light";
    try {
      initial = parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
      // Storage may be unavailable; switching still works for this visit.
    }
    updateTheme(initial);
    applyTheme(initial);
    setReady(true);

    const syncTheme = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      const next = parseTheme(event.newValue);
      updateTheme(next);
      applyTheme(next);
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  const setTheme = (next: Theme) => {
    updateTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Keep the selected theme even when persistence is blocked.
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, ready, setTheme, toggleTheme: () => setTheme(theme === "light" ? "dark" : "light") }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}