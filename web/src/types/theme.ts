export const THEME_NAMES = ["starship", "cyberpunk", "terminal", "holographic", "retro", "mcdu"] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

export const DEFAULT_THEME: ThemeName = "cyberpunk";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  colors: {
    background: string;
    foreground: string;
    accent: string;
    accentSecondary: string;
    surface: string;
  };
}

export const THEME_CONFIGS: Record<ThemeName, ThemeConfig> = {
  starship: {
    name: "starship",
    label: "Starship",
    fonts: {
      display: "'Antonio', sans-serif",
      body: "'Antonio', sans-serif",
      mono: "'Antonio', sans-serif",
    },
    colors: {
      background: "#000000",
      foreground: "#ffffff",
      accent: "#ffaa00",
      accentSecondary: "#cc6699",
      surface: "#000000",
    },
  },
  cyberpunk: {
    name: "cyberpunk",
    label: "Cyberpunk",
    fonts: {
      display: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
      mono: "'Share Tech Mono', monospace",
    },
    colors: {
      background: "#0a0a0f",
      foreground: "#e0e0ff",
      accent: "#00f3ff",
      accentSecondary: "#ff0055",
      surface: "rgba(13, 13, 26, 0.7)",
    },
  },
  terminal: {
    name: "terminal",
    label: "Retro Terminal",
    fonts: {
      display: "'VT323', monospace",
      body: "'VT323', monospace",
      mono: "'VT323', monospace",
    },
    colors: {
      background: "#0D0208",
      foreground: "#00FF41",
      accent: "#00FF41",
      accentSecondary: "#008F11",
      surface: "#0D0208",
    },
  },
  holographic: {
    name: "holographic",
    label: "Holographic",
    fonts: {
      display: "'Exo 2', sans-serif",
      body: "'Exo 2', sans-serif",
      mono: "'Share Tech Mono', monospace",
    },
    colors: {
      background: "#0a0e1a",
      foreground: "#E4EFF0",
      accent: "#00DCDC",
      accentSecondary: "#FF6B35",
      surface: "rgba(0, 220, 220, 0.06)",
    },
  },
  retro: {
    name: "retro",
    label: "Retro OS",
    fonts: {
      display: "system-ui, sans-serif",
      body: "system-ui, sans-serif",
      mono: "'Courier New', monospace",
    },
    colors: {
      background: "#008080",
      foreground: "#000000",
      accent: "#000080",
      accentSecondary: "#C0C0C0",
      surface: "#C0C0C0",
    },
  },
  mcdu: {
    name: "mcdu",
    label: "MCDU",
    fonts: {
      display: "'B612 Mono', 'Courier New', monospace",
      body: "'B612 Mono', 'Courier New', monospace",
      mono: "'B612 Mono', 'Courier New', monospace",
    },
    colors: {
      background: "#1a1a1a",
      foreground: "#00ff00",
      accent: "#00ff00",
      accentSecondary: "#ffaa00",
      surface: "#2a2a2a",
    },
  },
};
