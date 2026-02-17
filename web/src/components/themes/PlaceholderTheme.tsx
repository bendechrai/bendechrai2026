"use client";

import { useTheme } from "@/context/ThemeContext";
import { THEME_CONFIGS, type ThemeName } from "@/types/theme";

export default function PlaceholderTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        fontFamily: "var(--font-display)",
      }}
    >
      <h1
        style={{
          color: "var(--color-accent)",
          fontSize: "2rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        Ben de Chrai
      </h1>
      <p style={{ color: "var(--color-fg)", opacity: 0.7 }}>
        Active theme: <strong>{THEME_CONFIGS[theme].label}</strong>
      </p>
      <p style={{ color: "var(--color-fg)", opacity: 0.5, fontSize: "0.875rem" }}>
        This theme is under construction.
      </p>
      <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        {(Object.keys(THEME_CONFIGS) as ThemeName[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: "0.5rem 1rem",
              background: t === theme ? "var(--color-accent)" : "transparent",
              color: t === theme ? "var(--color-bg)" : "var(--color-accent)",
              border: "1px solid var(--color-accent)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {THEME_CONFIGS[t].label}
          </button>
        ))}
      </nav>
    </main>
  );
}
