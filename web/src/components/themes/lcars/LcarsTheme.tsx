"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";

const STARDATE = (() => {
  const now = typeof performance !== "undefined" ? performance.timeOrigin : 0;
  return `SD ${Math.floor(now / 86400000)}.${Math.floor((now % 86400000) / 8640000)}`;
})();
import styles from "./lcars.module.css";

type Section = "articles" | "events" | "talks" | "contact";

const NAV_ITEMS: { id: Section; label: string; color: string }[] = [
  { id: "articles", label: "ARTICLES", color: "#ffaa00" },
  { id: "events", label: "EVENTS", color: "#cc99ff" },
  { id: "talks", label: "TALKS", color: "#99ccff" },
  { id: "contact", label: "CONTACT", color: "#cc6699" },
];

function SectionContent({ section }: { section: Section }) {
  switch (section) {
    case "articles":
      return (
        <>
          <h2 className={styles.contentTitle}>PUBLISHED WRITINGS</h2>
          <p className={styles.contentText}>No articles available at this time.</p>
          <p className={styles.contentText}>Check back for updates to the database.</p>
        </>
      );
    case "events":
      return (
        <>
          <h2 className={styles.contentTitle}>UPCOMING APPEARANCES</h2>
          <p className={styles.contentText}>No scheduled events at this time.</p>
          <p className={styles.contentText}>Monitoring subspace channels for updates.</p>
        </>
      );
    case "talks":
      return (
        <>
          <h2 className={styles.contentTitle}>TALKS &amp; WORKSHOPS</h2>
          <p className={styles.contentText}>Presentation archives loading.</p>
          <p className={styles.contentText}>Stand by for data retrieval.</p>
        </>
      );
    case "contact":
      return (
        <>
          <h2 className={styles.contentTitle}>COMMUNICATIONS</h2>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>SUBSPACE EMAIL</span>
            <span className={styles.dataValue}>hello@bendechrai.com</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>CODE ARCHIVE</span>
            <span className={styles.dataValue}>github.com/bendechrai</span>
          </div>
        </>
      );
  }
}

export default function LcarsTheme() {
  const { setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>("articles");
  const [commandInput, setCommandInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (["articles", "1"].includes(trimmed)) setActiveSection("articles");
      else if (["events", "2"].includes(trimmed)) setActiveSection("events");
      else if (["talks", "3"].includes(trimmed)) setActiveSection("talks");
      else if (["contact", "4"].includes(trimmed)) setActiveSection("contact");
      else if (trimmed.startsWith("theme ")) {
        const name = trimmed.slice(6).trim();
        const valid = ["lcars", "cyberpunk", "terminal", "holographic", "win31"];
        if (valid.includes(name)) {
          setTimeout(() => setTheme(name as Parameters<typeof setTheme>[0]), 300);
        }
      }
    },
    [setTheme],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(commandInput);
      setCommandInput("");
    }
  };

  return (
    <div className={styles.frame}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft} />
        <div className={styles.topBarHeader}>
          <span className={styles.headerText}>BEN DECHRAI</span>
          <span className={styles.stardate}>{STARDATE}</span>
        </div>
      </div>

      {/* Main Area: Sidebar + Content */}
      <div className={styles.mainArea}>
        {/* Elbow + Sidebar */}
        <div className={styles.sidebarColumn}>
          <div className={styles.elbowTop} />
          <nav className={styles.sidebar} role="navigation" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`${styles.pill} ${activeSection === item.id ? styles.pillActive : ""}`}
                style={{
                  "--pill-color": item.color,
                  "--pill-active": activeSection === item.id ? item.color : undefined,
                } as React.CSSProperties}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            {/* Decorative status indicators */}
            <div className={styles.statusBlock} style={{ background: "#cc99cc" }} />
            <div className={styles.statusBlock} style={{ background: "#99ccff" }} />
            <div className={styles.statusBlock} style={{ background: "#ffaa00" }} />
          </nav>
          <div className={styles.elbowBottom} />
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          <SectionContent section={activeSection} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarLeft} />
        <div className={styles.commandArea} onClick={() => inputRef.current?.focus()}>
          <span className={styles.promptLabel}>LCARS &gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.commandInput}
            spellCheck={false}
            autoComplete="off"
            aria-label="LCARS command input"
          />
        </div>
      </div>
    </div>
  );
}
