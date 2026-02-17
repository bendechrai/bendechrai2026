"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import styles from "./win31.module.css";

interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

type ContentId = "articles" | "events" | "talks" | "contact" | "dos";

const DESKTOP_ICONS: { id: ContentId; label: string }[] = [
  { id: "articles", label: "Articles" },
  { id: "events", label: "Events" },
  { id: "talks", label: "Talks" },
  { id: "contact", label: "Contact" },
];

function getInitialWindows(): WindowState[] {
  const vw = typeof window !== "undefined" ? window.innerWidth : 800;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;
  const isMobile = vw < 640;

  return [
    {
      id: "program-manager",
      title: "Program Manager",
      x: isMobile ? 4 : 40,
      y: isMobile ? 4 : 30,
      width: isMobile ? vw - 8 : Math.min(460, vw - 80),
      height: isMobile ? vh * 0.45 : 280,
      minimized: false,
      maximized: isMobile,
      zIndex: 1,
    },
    {
      id: "dos",
      title: "DOS Prompt",
      x: isMobile ? 4 : 80,
      y: isMobile ? vh * 0.5 : 200,
      width: isMobile ? vw - 8 : Math.min(500, vw - 80),
      height: isMobile ? vh * 0.45 : 260,
      minimized: true,
      maximized: false,
      zIndex: 0,
    },
  ];
}

function WindowContent({ windowId, onOpenWindow }: { windowId: string; onOpenWindow: (id: ContentId) => void }) {
  const { setTheme } = useTheme();
  const [dosInput, setDosInput] = useState("");
  const [dosLines, setDosLines] = useState<string[]>([
    "Microsoft(R) MS-DOS(R) Version 6.22",
    "(C)Copyright Microsoft Corp 1981-1994.",
    "",
  ]);
  const dosInputRef = useRef<HTMLInputElement>(null);

  const handleDosCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      setDosLines((prev) => [...prev, `C:\\BENDECHRAI> ${cmd}`]);
      if (trimmed === "help") {
        setDosLines((prev) => [
          ...prev,
          "  articles  events  talks  contact  theme <name>  cls",
        ]);
      } else if (trimmed === "cls") {
        setDosLines([]);
      } else if (trimmed.startsWith("theme ")) {
        const name = trimmed.slice(6).trim();
        const valid = ["lcars", "cyberpunk", "terminal", "holographic", "win31"];
        if (valid.includes(name)) {
          setDosLines((prev) => [...prev, `Switching to ${name}...`]);
          setTimeout(() => setTheme(name as Parameters<typeof setTheme>[0]), 400);
        } else {
          setDosLines((prev) => [...prev, `Bad command or theme name. Valid: ${valid.join(", ")}`]);
        }
      } else if (["articles", "events", "talks", "contact"].includes(trimmed)) {
        onOpenWindow(trimmed as ContentId);
      } else if (trimmed !== "") {
        setDosLines((prev) => [...prev, `Bad command or file name`]);
      }
    },
    [setTheme, onOpenWindow],
  );

  if (windowId === "program-manager") {
    return (
      <div className={styles.programManager}>
        <div className={styles.menuBar}>
          <span className={styles.menuItem}>File</span>
          <span className={styles.menuItem}>Options</span>
          <span className={styles.menuItem}>Window</span>
          <span className={styles.menuItem}>Help</span>
        </div>
        <div className={styles.iconGrid}>
          {DESKTOP_ICONS.map((icon) => (
            <button
              key={icon.id}
              className={styles.desktopIcon}
              onDoubleClick={() => onOpenWindow(icon.id)}
              onClick={() => onOpenWindow(icon.id)}
            >
              <div className={styles.iconImage}>
                {icon.id === "articles" && "📄"}
                {icon.id === "events" && "📅"}
                {icon.id === "talks" && "🎤"}
                {icon.id === "contact" && "✉️"}
              </div>
              <span className={styles.iconLabel}>{icon.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (windowId === "dos") {
    return (
      <div className={styles.dosWindow} onClick={() => dosInputRef.current?.focus()}>
        <div className={styles.dosOutput}>
          {dosLines.map((line, i) => (
            <div key={i}>{line || "\u00A0"}</div>
          ))}
        </div>
        <div className={styles.dosPromptLine}>
          <span>C:\BENDECHRAI&gt;&nbsp;</span>
          <input
            ref={dosInputRef}
            type="text"
            value={dosInput}
            onChange={(e) => setDosInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleDosCommand(dosInput);
                setDosInput("");
              }
            }}
            className={styles.dosInput}
            spellCheck={false}
            autoComplete="off"
            aria-label="DOS command input"
          />
        </div>
      </div>
    );
  }

  const contentMap: Record<string, React.ReactNode> = {
    articles: (
      <div className={styles.notepadContent}>
        <p>No articles published yet.</p>
        <p>Check back soon for new content.</p>
      </div>
    ),
    events: (
      <div className={styles.notepadContent}>
        <p>No upcoming events scheduled.</p>
      </div>
    ),
    talks: (
      <div className={styles.notepadContent}>
        <p>Talks and workshop information coming soon.</p>
      </div>
    ),
    contact: (
      <div className={styles.notepadContent}>
        <p>Email: hello@bendechrai.com</p>
        <p>GitHub: github.com/bendechrai</p>
      </div>
    ),
  };

  return contentMap[windowId] || <div className={styles.notepadContent}><p>Unknown window.</p></div>;
}

export default function Win31Theme() {
  const [windows, setWindows] = useState<WindowState[]>(() => getInitialWindows());
  const [topZ, setTopZ] = useState(2);
  const dragRef = useRef<{ winId: string; offsetX: number; offsetY: number } | null>(null);

  const bringToFront = useCallback(
    (id: string) => {
      setTopZ((z) => {
        const newZ = z + 1;
        setWindows((prev) =>
          prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w)),
        );
        return newZ;
      });
    },
    [],
  );

  const openWindow = useCallback(
    (contentId: ContentId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === contentId);
        if (existing) {
          return prev.map((w) =>
            w.id === contentId ? { ...w, minimized: false } : w,
          );
        }
        const titles: Record<string, string> = {
          articles: "Articles - Notepad",
          events: "Events - Notepad",
          talks: "Talks - Notepad",
          contact: "Contact - Notepad",
          dos: "DOS Prompt",
        };
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw < 640;
        const newWin: WindowState = {
          id: contentId,
          title: titles[contentId] || contentId,
          x: isMobile ? 4 : 100 + Math.random() * 100,
          y: isMobile ? 4 : 60 + Math.random() * 80,
          width: isMobile ? vw - 8 : Math.min(420, vw - 80),
          height: isMobile ? vh - 40 : 300,
          minimized: false,
          maximized: false,
          zIndex: topZ + 1,
        };
        setTopZ((z) => z + 1);
        return [...prev, newWin];
      });
      bringToFront(contentId);
    },
    [topZ, bringToFront],
  );

  const toggleMinimize = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
      );
    },
    [],
  );

  const toggleMaximize = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
      );
    },
    [],
  );

  const closeWindow = useCallback(
    (id: string) => {
      if (id === "program-manager" || id === "dos") {
        toggleMinimize(id);
        return;
      }
      setWindows((prev) => prev.filter((w) => w.id !== id));
    },
    [toggleMinimize],
  );

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent, winId: string) => {
      const win = windows.find((w) => w.id === winId);
      if (!win || win.maximized) return;
      bringToFront(winId);
      dragRef.current = {
        winId,
        offsetX: e.clientX - win.x,
        offsetY: e.clientY - win.y,
      };
    },
    [windows, bringToFront],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { winId, offsetX, offsetY } = dragRef.current;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === winId
            ? { ...w, x: e.clientX - offsetX, y: e.clientY - offsetY }
            : w,
        ),
      );
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const minimizedWindows = windows.filter((w) => w.minimized);

  return (
    <div className={styles.desktop}>
      {/* Windows */}
      {windows.map(
        (win) =>
          !win.minimized && (
            <div
              key={win.id}
              className={styles.window}
              style={
                win.maximized
                  ? { inset: 0, width: "100%", height: "100%", zIndex: win.zIndex }
                  : {
                      left: win.x,
                      top: win.y,
                      width: win.width,
                      height: win.height,
                      zIndex: win.zIndex,
                    }
              }
              onMouseDown={() => bringToFront(win.id)}
            >
              <div
                className={styles.titleBar}
                onMouseDown={(e) => handleTitleMouseDown(e, win.id)}
              >
                <span className={styles.titleText}>{win.title}</span>
                <div className={styles.titleButtons}>
                  <button
                    className={styles.titleBtn}
                    onClick={() => toggleMinimize(win.id)}
                    aria-label="Minimize"
                  >
                    _
                  </button>
                  <button
                    className={styles.titleBtn}
                    onClick={() => toggleMaximize(win.id)}
                    aria-label="Maximize"
                  >
                    □
                  </button>
                  <button
                    className={styles.titleBtn}
                    onClick={() => closeWindow(win.id)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.windowBody}>
                <WindowContent windowId={win.id} onOpenWindow={openWindow} />
              </div>
            </div>
          ),
      )}

      {/* Minimized Icons */}
      {minimizedWindows.length > 0 && (
        <div className={styles.taskbar}>
          {minimizedWindows.map((win) => (
            <button
              key={win.id}
              className={styles.taskbarIcon}
              onClick={() => {
                toggleMinimize(win.id);
                bringToFront(win.id);
              }}
            >
              {win.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
