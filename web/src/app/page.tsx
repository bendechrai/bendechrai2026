"use client";

import { useTheme } from "@/context/ThemeContext";
import TerminalTheme from "@/components/themes/terminal/TerminalTheme";
import CyberpunkTheme from "@/components/themes/cyberpunk/CyberpunkTheme";
import LcarsTheme from "@/components/themes/lcars/LcarsTheme";
import HolographicTheme from "@/components/themes/holographic/HolographicTheme";
import PlaceholderTheme from "@/components/themes/PlaceholderTheme";

const THEME_COMPONENTS: Record<string, React.ComponentType> = {
  terminal: TerminalTheme,
  cyberpunk: CyberpunkTheme,
  lcars: LcarsTheme,
  holographic: HolographicTheme,
};

export default function Home() {
  const { theme } = useTheme();
  const ThemeComponent = THEME_COMPONENTS[theme] || PlaceholderTheme;
  return <ThemeComponent />;
}
