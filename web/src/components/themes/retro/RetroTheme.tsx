"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, PROJECTS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";
import { useSection } from "@/hooks/useSection";
import styles from "./retro.module.css";

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

type ContentId = "articles" | "events" | "talks" | "projects" | "contact" | "dos";

const DESKTOP_ICONS: { id: ContentId; label: string; path: string }[] = [
  { id: "articles", label: "Articles", path: "/articles" },
  { id: "events", label: "Events", path: "/events" },
  { id: "talks", label: "Talks", path: "/talks" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "contact", label: "Message", path: "/contact" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitialWindows(): WindowState[] {
  const vw = typeof window !== "undefined" ? window.innerWidth : 800;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;
  const isMobile = vw < 640;

  return [
    {
      id: "program-manager",
      title: "Desktop Manager",
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
      title: "Command Prompt",
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

function WindowContent({ windowId, articleSlug, navigate, onOpenWindow }: { windowId: string; articleSlug: string | null; navigate: (p: string) => void; onOpenWindow: (id: ContentId) => void }) {
  const { setTheme } = useTheme();
  const [dosInput, setDosInput] = useState("");
  const [dosLines, setDosLines] = useState<string[]>([
    "RetroOS Command Line v1.0",
    "",
  ]);
  const dosInputRef = useRef<HTMLInputElement>(null);

  const [msgName, setMsgName] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleMsgSend = async () => {
    if (!msgName.trim() || !msgBody.trim() || sending) return;
    setSending(true);
    await sendMessage(msgName.trim(), msgBody.trim());
    setSending(false);
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setMsgName("");
      setMsgBody("");
    }, 4000);
  };

  const handleDosCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      setDosLines((prev) => [...prev, `C:\\BENDECHRAI> ${cmd}`]);
      if (trimmed === "help") {
        setDosLines((prev) => [
          ...prev,
          "  articles  events  talks  projects  contact  theme <name>  cls",
        ]);
      } else if (trimmed === "cls") {
        setDosLines([]);
      } else if (trimmed.startsWith("theme ")) {
        const name = trimmed.slice(6).trim();
        const valid = ["starship", "cyberpunk", "terminal", "holographic", "retro", "mcdu"];
        if (valid.includes(name)) {
          setDosLines((prev) => [...prev, `Switching to ${name}...`]);
          setTimeout(() => setTheme(name as Parameters<typeof setTheme>[0]), 400);
        } else {
          setDosLines((prev) => [...prev, `Bad command or theme name. Valid: ${valid.join(", ")}`]);
        }
      } else if (["articles", "events", "talks", "projects", "contact"].includes(trimmed)) {
        const pathMap: Record<string, string> = {
          articles: "/articles",
          events: "/events",
          talks: "/talks",
          projects: "/projects",
          contact: "/contact",
        };
        navigate(pathMap[trimmed]);
        onOpenWindow(trimmed as ContentId);
      } else if (trimmed !== "") {
        setDosLines((prev) => [...prev, `Bad command or file name`]);
      }
    },
    [setTheme, onOpenWindow, navigate],
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
              onDoubleClick={() => { navigate(icon.path); onOpenWindow(icon.id); }}
              onClick={() => { navigate(icon.path); onOpenWindow(icon.id); }}
            >
              <div className={styles.iconImage}>
                {icon.id === "articles" && "\u{1F4C4}"}
                {icon.id === "events" && "\u{1F4C5}"}
                {icon.id === "talks" && "\u{1F3A4}"}
                {icon.id === "projects" && "\u{1F680}"}
                {icon.id === "contact" && "\u{1F4E8}"}
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
            aria-label="Command prompt input"
          />
        </div>
      </div>
    );
  }

  if (windowId === "contact") {
    return (
      <div className={styles.notepadContent}>
        <div className={styles.msgHeader}>Message 1.0</div>
        <div className={styles.msgLinks}>
          <p><a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub: github.com/bendechrai</a></p>
          <p><a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn: linkedin.com/in/bendechrai</a></p>
          <p><a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer">Twitter: twitter.com/bendechrai</a></p>
        </div>
        <hr className={styles.msgDivider} />
        {msgSent ? (
          <div className={styles.msgSent}>
            <p><b>Message Sent!</b></p>
            <p>Your message has been delivered to Ben&apos;s inbox.</p>
          </div>
        ) : (
          <div className={styles.msgForm}>
            <div className={styles.msgField}>
              <label>From:</label>
              <input
                type="text"
                value={msgName}
                onChange={(e) => setMsgName(e.target.value)}
                className={styles.msgInput}
                placeholder="Your name"
              />
            </div>
            <div className={styles.msgField}>
              <label>Message:</label>
              <textarea
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                className={styles.msgTextarea}
                placeholder="Type your message here..."
                rows={4}
              />
            </div>
            <button
              className={styles.msgSendBtn}
              onClick={handleMsgSend}
              disabled={!msgName.trim() || !msgBody.trim() || sending}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (windowId === "articles") {
    if (articleSlug) {
      const article = getArticleBySlug(articleSlug);
      if (article) {
        return (
          <div className={styles.notepadContent}>
            <p><a href="#" onClick={(e) => { e.preventDefault(); navigate("/articles"); }} style={{ cursor: "pointer" }}>&lt; Back to Articles</a></p>
            <div style={{ marginBottom: "12px" }}>
              <p><b>{article.title}</b></p>
              <p><i>{formatDate(article.date)}</i></p>
              {article.image && <img src={article.image} alt="" className={styles.articleImage} />}
              <p>{article.summary}</p>
              {article.body && article.body.split("\n\n").map((para, i) => (
                <p key={i} style={{ marginTop: "6px" }}>{para}</p>
              ))}
            </div>
          </div>
        );
      }
    }
    return (
      <div className={styles.notepadContent}>
        {ARTICLES.map((a) => (
          <div key={a.slug} style={{ marginBottom: "12px", cursor: "pointer" }} onClick={() => navigate(`/articles/${a.slug}`)}>
            <p><b>{a.title}</b></p>
            <p><i>{formatDate(a.date)}</i></p>
            <p>{a.summary}</p>
          </div>
        ))}
      </div>
    );
  }

  const contentMap: Record<string, React.ReactNode> = {
    events: (
      <div className={styles.notepadContent}>
        {EVENTS.map((ev) => (
          <div key={ev.name} style={{ marginBottom: "12px" }}>
            <p><b>{ev.name}</b> [{ev.role.toUpperCase()}]</p>
            <p>{formatDate(ev.date)} - {ev.location}</p>
            {ev.talk && <p>Talk: {ev.talk}</p>}
          </div>
        ))}
        <hr />
        <p><b>Talks &amp; Workshops</b></p>
        {TALKS.map((t) => (
          <div key={t.title} style={{ marginBottom: "12px" }}>
            <p><b>{t.title}</b> [{t.type.toUpperCase()}]</p>
            <p>{t.event} - {formatDate(t.date)}</p>
            <p>{t.description}</p>
          </div>
        ))}
      </div>
    ),
    talks: (
      <div className={styles.notepadContent}>
        {TALKS.map((t) => (
          <div key={t.title} style={{ marginBottom: "12px" }}>
            <p><b>{t.title}</b> [{t.type.toUpperCase()}]</p>
            <p>{t.event} - {formatDate(t.date)}</p>
            <p>{t.description}</p>
          </div>
        ))}
      </div>
    ),
    projects: (
      <div className={styles.notepadContent}>
        {PROJECTS.map((p) => (
          <div key={p.name} style={{ marginBottom: "12px" }}>
            <p><b>{p.name}</b> [{p.status.toUpperCase()}]</p>
            <p>{p.tagline}</p>
            <p>Tech: {p.tech.join(", ")}</p>
            <p><a href={p.url} target="_blank" rel="noopener noreferrer">{p.url}</a></p>
          </div>
        ))}
      </div>
    ),
  };

  return contentMap[windowId] || <div className={styles.notepadContent}><p>Unknown window.</p></div>;
}

export default function RetroTheme() {
  const { section, articleSlug, navigate } = useSection();
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
          projects: "Projects - Notepad",
          contact: "Message 1.0",
          dos: "Command Prompt",
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

  // Auto-open window based on URL section on mount
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && section !== "home") {
      initializedRef.current = true;
      const sectionToContentId: Record<string, ContentId> = {
        articles: "articles",
        events: "events",
        talks: "talks",
        projects: "projects",
        contact: "contact",
      };
      const contentId = sectionToContentId[section];
      if (contentId) {
        openWindow(contentId);
      }
    }
  }, [section, openWindow]);

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
                <WindowContent windowId={win.id} articleSlug={articleSlug} navigate={navigate} onOpenWindow={openWindow} />
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
