"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  type ThemeName,
  THEME_NAMES,
  DEFAULT_THEME,
  THEME_CONFIGS,
} from "@/types/theme";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  config: (typeof THEME_CONFIGS)[ThemeName];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Migrate old theme names to new ones
const THEME_MIGRATIONS: Record<string, string> = {
  lcars: "starship",
  win31: "retro",
};

function getInitialTheme(): ThemeName {
  if (typeof window === "undefined") return DEFAULT_THEME;

  // Check URL query param — save to localStorage and strip from URL
  const params = new URLSearchParams(window.location.search);
  const queryTheme = params.get("theme");
  if (queryTheme) {
    const migrated = (THEME_MIGRATIONS[queryTheme] || queryTheme) as ThemeName;
    if (THEME_NAMES.includes(migrated)) {
      localStorage.setItem("theme", migrated);
      const url = new URL(window.location.href);
      url.searchParams.delete("theme");
      window.history.replaceState({}, "", url.toString());
      return migrated;
    }
  }

  // Check localStorage (with migration)
  const stored = localStorage.getItem("theme");
  if (stored) {
    const migrated = (THEME_MIGRATIONS[stored] || stored) as ThemeName;
    if (THEME_NAMES.includes(migrated)) {
      if (migrated !== stored) localStorage.setItem("theme", migrated);
      return migrated;
    }
  }

  return DEFAULT_THEME;
}

// Track mount state externally to avoid setState-in-effect lint error
function useMounted() {
  return useSyncExternalStore(
    (cb) => {
      // Subscribe is a no-op since mounted state doesn't change after mount
      cb();
      return () => {};
    },
    () => true,   // client: always mounted
    () => false,   // server: not mounted
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [theme, setThemeState] = useState<ThemeName>(() =>
    typeof window !== "undefined" ? getInitialTheme() : DEFAULT_THEME,
  );

  const setTheme = useCallback((newTheme: ThemeName) => {
    if (!THEME_NAMES.includes(newTheme)) return;
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    const config = THEME_CONFIGS[theme];
    root.style.setProperty("--color-bg", config.colors.background);
    root.style.setProperty("--color-fg", config.colors.foreground);
    root.style.setProperty("--color-accent", config.colors.accent);
    root.style.setProperty("--color-accent-secondary", config.colors.accentSecondary);
    root.style.setProperty("--color-surface", config.colors.surface);
    root.style.setProperty("--font-display", config.fonts.display);
    root.style.setProperty("--font-body", config.fonts.body);
    root.style.setProperty("--font-mono", config.fonts.mono);
  }, [theme, mounted]);

  if (!mounted) {
    return <div style={{ background: THEME_CONFIGS[DEFAULT_THEME].colors.background, minHeight: "100vh" }} />;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config: THEME_CONFIGS[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
