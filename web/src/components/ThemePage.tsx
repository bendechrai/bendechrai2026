"use client";

import { useTheme } from "@/context/ThemeContext";
import BootSequence from "@/components/BootSequence";
import TerminalTheme from "@/components/themes/terminal/TerminalTheme";
import CyberpunkTheme from "@/components/themes/cyberpunk/CyberpunkTheme";
import StarshipTheme from "@/components/themes/starship/StarshipTheme";
import HolographicTheme from "@/components/themes/holographic/HolographicTheme";
import RetroTheme from "@/components/themes/retro/RetroTheme";
import FmsTheme from "@/components/themes/fms/FmsTheme";
import PlaceholderTheme from "@/components/themes/PlaceholderTheme";

const THEME_COMPONENTS: Record<string, React.ComponentType> = {
  terminal: TerminalTheme,
  cyberpunk: CyberpunkTheme,
  starship: StarshipTheme,
  holographic: HolographicTheme,
  retro: RetroTheme,
  fms: FmsTheme,
};

export default function ThemePage() {
  const { theme } = useTheme();
  const ThemeComponent = THEME_COMPONENTS[theme] || PlaceholderTheme;

  return (
    <BootSequence>
      <ThemeComponent />
    </BootSequence>
  );
}
