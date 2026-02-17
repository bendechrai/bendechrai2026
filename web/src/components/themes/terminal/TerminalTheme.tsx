"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import styles from "./terminal.module.css";

interface TerminalLine {
  id: number;
  text: string;
  type: "output" | "input" | "header" | "separator" | "menu" | "ascii";
}

const WELCOME_LINES: TerminalLine[] = [
  { id: 1, text: "╔════════════════════════════════════════════════════════════════╗", type: "separator" },
  { id: 2, text: "║  SYSTEM v2.4.7 - BEN DE CHRAI PERSONAL TERMINAL              ║", type: "header" },
  { id: 3, text: "║  Connection established: " + new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC          ║", type: "header" },
  { id: 4, text: "╚════════════════════════════════════════════════════════════════╝", type: "separator" },
  { id: 5, text: "", type: "output" },
  { id: 6, text: "  Welcome to the personal terminal of Ben de Chrai.", type: "output" },
  { id: 7, text: "", type: "output" },
  { id: 8, text: "  Available commands:", type: "output" },
  { id: 9, text: "", type: "output" },
  { id: 10, text: "    1) articles    - Published writings", type: "menu" },
  { id: 11, text: "    2) events      - Upcoming appearances", type: "menu" },
  { id: 12, text: "    3) talks       - Talks & workshops", type: "menu" },
  { id: 13, text: "    4) contact     - Get in touch", type: "menu" },
  { id: 14, text: "    5) help        - Show this menu", type: "menu" },
  { id: 15, text: "    6) theme <n>   - Change visual theme", type: "menu" },
  { id: 16, text: "", type: "output" },
  { id: 17, text: "  Type a command or number to continue.", type: "output" },
  { id: 18, text: "", type: "output" },
];

export default function TerminalTheme() {
  const { setTheme } = useTheme();
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLines = useCallback((newLines: string[], type: TerminalLine["type"] = "output") => {
    setNextId((prev) => {
      const startId = prev;
      setLines((old) => [
        ...old,
        ...newLines.map((text, i) => ({ id: startId + i, text, type })),
      ]);
      return prev + newLines.length;
    });
  }, []);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      addLines([`> ${cmd}`], "input");

      if (trimmed === "" ) return;

      if (trimmed === "help" || trimmed === "5") {
        addLines([
          "",
          "  Available commands:",
          "",
          "    1) articles    - Published writings",
          "    2) events      - Upcoming appearances",
          "    3) talks       - Talks & workshops",
          "    4) contact     - Get in touch",
          "    5) help        - Show this menu",
          "    6) theme <n>   - Change visual theme",
          "",
        ], "menu");
      } else if (trimmed === "clear") {
        setLines([]);
      } else if (trimmed === "articles" || trimmed === "1") {
        addLines([
          "",
          "┌──────────────────────────────────────────────────────────┐",
          "│  ARTICLES                                                │",
          "├──────────────────────────────────────────────────────────┤",
          "│                                                          │",
          "│  No articles loaded yet. Check back soon.                │",
          "│                                                          │",
          "└──────────────────────────────────────────────────────────┘",
          "",
        ]);
      } else if (trimmed === "events" || trimmed === "2") {
        addLines([
          "",
          "┌──────────────────────────────────────────────────────────┐",
          "│  EVENTS                                                  │",
          "├──────────────────────────────────────────────────────────┤",
          "│                                                          │",
          "│  No upcoming events. Check back soon.                    │",
          "│                                                          │",
          "└──────────────────────────────────────────────────────────┘",
          "",
        ]);
      } else if (trimmed === "talks" || trimmed === "3") {
        addLines([
          "",
          "┌──────────────────────────────────────────────────────────┐",
          "│  TALKS & WORKSHOPS                                      │",
          "├──────────────────────────────────────────────────────────┤",
          "│                                                          │",
          "│  No talks scheduled. Check back soon.                    │",
          "│                                                          │",
          "└──────────────────────────────────────────────────────────┘",
          "",
        ]);
      } else if (trimmed === "contact" || trimmed === "4") {
        addLines([
          "",
          "┌──────────────────────────────────────────────────────────┐",
          "│  CONTACT                                                 │",
          "├──────────────────────────────────────────────────────────┤",
          "│                                                          │",
          "│  Email:   hello@bendechrai.com                           │",
          "│  GitHub:  github.com/bendechrai                          │",
          "│                                                          │",
          "└──────────────────────────────────────────────────────────┘",
          "",
        ]);
      } else if (trimmed.startsWith("theme ") || trimmed === "6") {
        const themeName = trimmed === "6" ? "" : trimmed.slice(6).trim();
        const validThemes = ["lcars", "cyberpunk", "terminal", "holographic", "win31"];
        if (validThemes.includes(themeName)) {
          addLines([``, `  Switching to ${themeName} theme...`, ``]);
          setTimeout(() => setTheme(themeName as Parameters<typeof setTheme>[0]), 500);
        } else {
          addLines([
            "",
            "  Available themes: lcars, cyberpunk, terminal, holographic, win31",
            "  Usage: theme <name>",
            "",
          ]);
        }
      } else {
        addLines([
          "",
          `  Unknown command: ${cmd}`,
          "  Type 'help' for available commands.",
          "",
        ]);
      }
    },
    [addLines, setTheme],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  const handleScreenClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.crt} onClick={handleScreenClick}>
      <div className={styles.scanline} />
      <div className={styles.screen}>
        <div className={styles.output} ref={scrollRef}>
          {lines.map((line) => (
            <div
              key={line.id}
              className={`${styles.line} ${
                line.type === "header" ? styles.bright :
                line.type === "separator" ? styles.dim :
                line.type === "input" ? styles.inputLine :
                line.type === "menu" ? styles.menu :
                ""
              }`}
            >
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>
        <div className={styles.prompt}>
          <span className={styles.promptChar}>&gt; </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command input"
          />
        </div>
      </div>
    </div>
  );
}
