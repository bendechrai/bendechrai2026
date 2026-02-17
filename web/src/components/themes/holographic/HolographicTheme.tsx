"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import styles from "./holographic.module.css";

type PanelId = "about" | "articles" | "events" | "talks" | "contact";

interface PanelConfig {
  id: PanelId;
  title: string;
}

const PANELS: PanelConfig[] = [
  { id: "about", title: "SYSTEM PROFILE" },
  { id: "articles", title: "ARTICLES" },
  { id: "events", title: "EVENTS" },
  { id: "talks", title: "TALKS" },
  { id: "contact", title: "CONTACT" },
];

function PanelContent({ id }: { id: PanelId }) {
  switch (id) {
    case "about":
      return (
        <>
          <div className={styles.dataLine}>
            <span className={styles.label}>IDENTITY</span>
            <span>Ben de Chrai</span>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>ROLE</span>
            <span>Developer &amp; Speaker</span>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>LOCATION</span>
            <span>Melbourne, AU</span>
          </div>
        </>
      );
    case "articles":
      return <p className={styles.emptyText}>No articles loaded. Stand by.</p>;
    case "events":
      return <p className={styles.emptyText}>No events scheduled. Monitoring channels.</p>;
    case "talks":
      return <p className={styles.emptyText}>Presentation archives initializing.</p>;
    case "contact":
      return (
        <>
          <div className={styles.dataLine}>
            <span className={styles.label}>EMAIL</span>
            <span>hello@bendechrai.com</span>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>GITHUB</span>
            <span>github.com/bendechrai</span>
          </div>
        </>
      );
  }
}

function HoloPanel({
  config,
  visible,
  onDismiss,
}: {
  config: PanelConfig;
  visible: boolean;
  onDismiss: () => void;
}) {
  if (!visible) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{config.title}</span>
        <button className={styles.dismissBtn} onClick={onDismiss} aria-label={`Close ${config.title}`}>
          &times;
        </button>
      </div>
      <div className={styles.panelBody}>
        <PanelContent id={config.id} />
      </div>
    </div>
  );
}

export default function HolographicTheme() {
  const { setTheme } = useTheme();
  const [visiblePanels, setVisiblePanels] = useState<Set<PanelId>>(new Set(["about"]));
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const paletteRef = useRef<HTMLInputElement>(null);

  const togglePanel = useCallback((id: PanelId) => {
    setVisiblePanels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openPalette = useCallback(() => {
    setPaletteOpen(true);
    setPaletteQuery("");
  }, []);

  useEffect(() => {
    if (paletteOpen) {
      setTimeout(() => paletteRef.current?.focus(), 50);
    }
  }, [paletteOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !paletteOpen && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [paletteOpen, openPalette]);

  const filteredCommands = (() => {
    const q = paletteQuery.toLowerCase();
    const commands = [
      ...PANELS.map((p) => ({
        label: p.title,
        action: () => { togglePanel(p.id); setPaletteOpen(false); },
      })),
      { label: "THEME LCARS", action: () => { setTheme("lcars"); setPaletteOpen(false); } },
      { label: "THEME CYBERPUNK", action: () => { setTheme("cyberpunk"); setPaletteOpen(false); } },
      { label: "THEME TERMINAL", action: () => { setTheme("terminal"); setPaletteOpen(false); } },
      { label: "THEME HOLOGRAPHIC", action: () => { setTheme("holographic"); setPaletteOpen(false); } },
      { label: "THEME WIN31", action: () => { setTheme("win31"); setPaletteOpen(false); } },
    ];
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  })();

  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredCommands.length > 0) {
      filteredCommands[0].action();
    }
  };

  return (
    <div className={styles.container}>
      {/* Grid Background */}
      <svg className={styles.gridBg} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="holoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,220,220,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holoGrid)" />
      </svg>

      {/* Floating Panels */}
      <div className={styles.panelsArea}>
        {PANELS.map((p) => (
          <HoloPanel
            key={p.id}
            config={p}
            visible={visiblePanels.has(p.id)}
            onDismiss={() => togglePanel(p.id)}
          />
        ))}

        {visiblePanels.size === 0 && (
          <div className={styles.emptyHint}>
            <p>Press <kbd>/</kbd> to open command palette</p>
          </div>
        )}
      </div>

      {/* Palette Trigger */}
      <button className={styles.paletteTrigger} onClick={openPalette} aria-label="Open command palette">
        /
      </button>

      {/* Command Palette */}
      {paletteOpen && (
        <div className={styles.paletteBackdrop} onClick={() => setPaletteOpen(false)}>
          <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
            <input
              ref={paletteRef}
              type="text"
              value={paletteQuery}
              onChange={(e) => setPaletteQuery(e.target.value)}
              onKeyDown={handlePaletteKeyDown}
              placeholder="Type a command..."
              className={styles.paletteInput}
              spellCheck={false}
              autoComplete="off"
            />
            <div className={styles.paletteResults}>
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.label}
                  className={styles.paletteItem}
                  onClick={cmd.action}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
