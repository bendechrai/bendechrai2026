"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import styles from "./cyberpunk.module.css";

type Tab = "data" | "comms" | "events" | "archives";

const TABS: { id: Tab; label: string }[] = [
  { id: "data", label: "DATA" },
  { id: "comms", label: "COMMS" },
  { id: "events", label: "EVENTS" },
  { id: "archives", label: "ARCHIVES" },
];

function StatusBar() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("en-GB"));

  useState(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString("en-GB")), 1000);
    return () => clearInterval(iv);
  });

  return (
    <div className={styles.statusBar}>
      <span>&gt; SYS://BENDECHRAI.NET</span>
      <span>{time}</span>
      <span>THREAT: LOW</span>
      <span>NET: ACTIVE</span>
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "data":
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>SYSTEM PROFILE</h2>
          <div className={styles.dataGrid}>
            <div className={styles.dataCard}>
              <div className={styles.dataLabel}>IDENTITY</div>
              <div className={styles.dataValue}>Ben de Chrai</div>
            </div>
            <div className={styles.dataCard}>
              <div className={styles.dataLabel}>ROLE</div>
              <div className={styles.dataValue}>Developer &amp; Speaker</div>
            </div>
            <div className={styles.dataCard}>
              <div className={styles.dataLabel}>STATUS</div>
              <div className={styles.dataValue}>
                <span className={styles.statusDot} /> ONLINE
              </div>
            </div>
            <div className={styles.dataCard}>
              <div className={styles.dataLabel}>LOCATION</div>
              <div className={styles.dataValue}>Melbourne, AU</div>
            </div>
          </div>
        </div>
      );
    case "comms":
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>COMMUNICATION CHANNELS</h2>
          <div className={styles.commsList}>
            <div className={styles.commsItem}>
              <span className={styles.commsLabel}>EMAIL</span>
              <span className={styles.commsValue}>hello@bendechrai.com</span>
            </div>
            <div className={styles.commsItem}>
              <span className={styles.commsLabel}>GITHUB</span>
              <span className={styles.commsValue}>github.com/bendechrai</span>
            </div>
          </div>
        </div>
      );
    case "events":
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>UPCOMING EVENTS</h2>
          <p className={styles.emptyState}>No events in the queue. Stand by.</p>
        </div>
      );
    case "archives":
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>ARCHIVED DATA</h2>
          <p className={styles.emptyState}>Archives loading... Check back soon.</p>
        </div>
      );
  }
}

export default function CyberpunkTheme() {
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("data");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "NIGHTCITY OS v4.2.1 — Unauthorized access will be prosecuted.",
    'Type "help" for available commands.',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      setTerminalLines((prev) => [...prev, `> ${cmd}`]);

      if (trimmed === "help") {
        setTerminalLines((prev) => [
          ...prev,
          "  articles | events | talks | contact | theme <name> | clear",
        ]);
      } else if (trimmed === "clear") {
        setTerminalLines([]);
      } else if (trimmed.startsWith("theme ")) {
        const name = trimmed.slice(6).trim();
        const valid = ["lcars", "cyberpunk", "terminal", "holographic", "win31"];
        if (valid.includes(name)) {
          setTerminalLines((prev) => [...prev, `  Switching to ${name}...`]);
          setTimeout(() => setTheme(name as Parameters<typeof setTheme>[0]), 400);
        } else {
          setTerminalLines((prev) => [
            ...prev,
            `  Unknown theme. Available: ${valid.join(", ")}`,
          ]);
        }
      } else if (["articles", "archives"].includes(trimmed)) {
        setActiveTab("archives");
        setTerminalLines((prev) => [...prev, "  Switching to ARCHIVES..."]);
      } else if (trimmed === "events") {
        setActiveTab("events");
        setTerminalLines((prev) => [...prev, "  Switching to EVENTS..."]);
      } else if (["talks", "contact", "comms"].includes(trimmed)) {
        setActiveTab("comms");
        setTerminalLines((prev) => [...prev, "  Switching to COMMS..."]);
      } else if (trimmed !== "") {
        setTerminalLines((prev) => [
          ...prev,
          `  Command not found: ${cmd}`,
        ]);
      }
    },
    [setTheme],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(terminalInput);
      setTerminalInput("");
    }
  };

  return (
    <div className={styles.container}>
      <StatusBar />

      <div className={styles.mainPanel}>
        <nav className={styles.tabBar} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.tabContent} role="tabpanel">
          <TabContent tab={activeTab} />
        </div>
      </div>

      <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
        <div className={styles.terminalOutput}>
          {terminalLines.map((line, i) => (
            <div key={i} className={styles.terminalLine}>{line}</div>
          ))}
        </div>
        <div className={styles.terminalPrompt}>
          <span className={styles.terminalPromptText}>&gt; user@system:~$ </span>
          <input
            ref={inputRef}
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.terminalInput}
            spellCheck={false}
            autoComplete="off"
            aria-label="Command input"
          />
        </div>
      </div>

      <div className={styles.scanlineOverlay} />
    </div>
  );
}
