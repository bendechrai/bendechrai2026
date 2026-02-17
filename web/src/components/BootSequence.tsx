"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeName } from "@/types/theme";

const BOOT_DURATION: Record<ThemeName, number> = {
  terminal: 4000,
  cyberpunk: 3000,
  lcars: 2000,
  holographic: 3000,
  win31: 2500,
};

function TerminalBoot({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const bootLines = [
    "[BIOS POST]",
    "Memory test... 640K OK",
    "Checking devices... OK",
    "",
    "Loading SYSTEM v2.4.7...",
    "████████████████████████ 100%",
    "",
    "Establishing connection...",
    `Connection established: ${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC`,
    "",
    "WELCOME TO THE PERSONAL TERMINAL OF BEN DE CHRAI",
    "Type 'help' for available commands.",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines((prev) => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 300);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0D0208",
        color: "#00FF41",
        fontFamily: "'VT323', monospace",
        fontSize: "1.125rem",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textShadow: "0 0 5px rgba(0,255,65,0.7), 0 0 10px rgba(0,255,65,0.4)",
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: "pre", minHeight: "1.4em" }}>
          {line || "\u00A0"}
        </div>
      ))}
      <div style={{ opacity: 0.4, marginTop: "1rem", fontSize: "0.8rem" }}>
        Click or press any key to skip
      </div>
    </div>
  );
}

function CyberpunkBoot({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 50),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => onComplete(), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: phase === 0 ? "#ffffff" : "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Orbitron', sans-serif",
        transition: "background 0.05s",
        overflow: "hidden",
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
          opacity: phase >= 1 ? 1 : 0,
          pointerEvents: "none",
        }}
      />
      {phase >= 2 && (
        <div
          style={{
            color: "#00f3ff",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textShadow: "0 0 7px #00f3ff, 0 0 10px #00f3ff",
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.3s",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          &gt; SYS://NIGHTCITY.NET — INITIALIZING...
        </div>
      )}
      {phase >= 3 && (
        <div
          style={{
            color: "#00f3ff",
            fontSize: "1.5rem",
            letterSpacing: "0.3em",
            textShadow: "0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 40px #00f3ff",
            marginTop: "1rem",
            textTransform: "uppercase",
          }}
        >
          SYSTEM ONLINE
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          color: "rgba(224,224,255,0.3)",
          fontSize: "0.7rem",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        Click or press any key to skip
      </div>
    </div>
  );
}

function LcarsBoot({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => onComplete(), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Antonio', sans-serif",
        gap: "1rem",
      }}
    >
      {phase >= 1 && (
        <div
          style={{
            width: "200px",
            height: "8px",
            background: "#ffaa00",
            borderRadius: "4px",
            animation: "fadeIn 0.3s ease",
          }}
        />
      )}
      {phase >= 2 && (
        <div
          style={{
            color: "#ffaa00",
            fontSize: "1.2rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          LCARS INTERFACE ACTIVE
        </div>
      )}
      {phase >= 3 && (
        <div
          style={{
            color: "#99ccff",
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            opacity: 0.6,
          }}
        >
          ALL SYSTEMS NOMINAL
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          color: "rgba(255,255,255,0.2)",
          fontSize: "0.7rem",
        }}
      >
        Click or press any key to skip
      </div>
    </div>
  );
}

function HolographicBoot({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => onComplete(), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0e1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Exo 2', sans-serif",
      }}
    >
      {/* Reticle ring */}
      {phase >= 1 && (
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ opacity: phase >= 3 ? 0.3 : 1, transition: "opacity 0.5s" }}>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#00DCDC"
            strokeWidth="1"
            strokeDasharray="314"
            strokeDashoffset={phase >= 1 ? "0" : "314"}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
      )}
      {phase >= 2 && (
        <div
          style={{
            color: "#00DCDC",
            fontSize: "0.85rem",
            fontWeight: 200,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: "1.5rem",
            opacity: phase >= 3 ? 0.8 : 1,
          }}
        >
          HOLOGRAPHIC INTERFACE INITIALIZED
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          color: "rgba(0,220,220,0.2)",
          fontSize: "0.7rem",
          fontWeight: 200,
          letterSpacing: "0.15em",
        }}
      >
        Click or press any key to skip
      </div>
    </div>
  );
}

function Win31Boot({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => onComplete(), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: phase >= 2 ? "#008080" : "#000080",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        gap: "0.5rem",
      }}
    >
      {phase < 2 && (
        <>
          {/* Windows logo - colored blocks */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", marginBottom: "1rem" }}>
            <div style={{ width: "24px", height: "24px", background: "#FF0000" }} />
            <div style={{ width: "24px", height: "24px", background: "#00FF00" }} />
            <div style={{ width: "24px", height: "24px", background: "#0000FF" }} />
            <div style={{ width: "24px", height: "24px", background: "#FFFF00" }} />
          </div>
          <div style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "bold" }}>
            Microsoft Windows
          </div>
          <div style={{ color: "#FFFFFF", fontSize: "12px" }}>
            Version 3.1
          </div>
        </>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          color: "rgba(255,255,255,0.3)",
          fontSize: "10px",
        }}
      >
        Click or press any key to skip
      </div>
    </div>
  );
}

const BOOT_COMPONENTS: Record<ThemeName, React.ComponentType<{ onComplete: () => void }>> = {
  terminal: TerminalBoot,
  cyberpunk: CyberpunkBoot,
  lcars: LcarsBoot,
  holographic: HolographicBoot,
  win31: Win31Boot,
};

function markBooted(t: string) {
  const existing = sessionStorage.getItem("booted-themes");
  const parsed: string[] = existing ? JSON.parse(existing) : [];
  if (!parsed.includes(t)) parsed.push(t);
  sessionStorage.setItem("booted-themes", JSON.stringify(parsed));
}

function isAlreadyBooted(t: string): boolean {
  const existing = sessionStorage.getItem("booted-themes");
  if (!existing) return false;
  return (JSON.parse(existing) as string[]).includes(t);
}

function shouldSkipBoot(theme: string): boolean {
  if (typeof window === "undefined") return true;
  if (isAlreadyBooted(theme)) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    markBooted(theme);
    return true;
  }
  return false;
}

function BootSequenceInner({ theme, children }: { theme: ThemeName; children: React.ReactNode }) {
  const [booted, setBooted] = useState(() => shouldSkipBoot(theme));

  const handleComplete = useCallback(() => {
    setBooted(true);
    markBooted(theme);
  }, [theme]);

  // Skip handler
  useEffect(() => {
    if (booted) return;
    const handleSkip = () => handleComplete();
    window.addEventListener("click", handleSkip);
    window.addEventListener("keydown", handleSkip);
    const timeout = setTimeout(handleComplete, BOOT_DURATION[theme] + 1000);
    return () => {
      window.removeEventListener("click", handleSkip);
      window.removeEventListener("keydown", handleSkip);
      clearTimeout(timeout);
    };
  }, [booted, theme, handleComplete]);

  if (booted) return <>{children}</>;

  const BootComponent = BOOT_COMPONENTS[theme];
  return <BootComponent onComplete={handleComplete} />;
}

export default function BootSequence({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  // Key on theme so the inner component re-mounts (fresh state) on theme change
  return <BootSequenceInner key={theme} theme={theme}>{children}</BootSequenceInner>;
}
