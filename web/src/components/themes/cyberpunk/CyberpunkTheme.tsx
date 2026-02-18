"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";
import { useSection } from "@/hooks/useSection";
import styles from "./cyberpunk.module.css";

type Tab = "data" | "comms" | "events" | "archives";

const TABS: { id: Tab; label: string; path: string }[] = [
  { id: "data", label: "DATA", path: "/" },
  { id: "comms", label: "COMMS", path: "/contact" },
  { id: "events", label: "EVENTS", path: "/events" },
  { id: "archives", label: "ARCHIVES", path: "/articles" },
];

function sectionToTab(section: string): Tab {
  switch (section) {
    case "articles": return "archives";
    case "events": return "events";
    case "talks": return "events";
    case "contact": return "comms";
    default: return "data";
  }
}

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function TabContent({ tab, articleSlug, navigate }: { tab: Tab; articleSlug: string | null; navigate: (p: string) => void }) {
  const [msgHandle, setMsgHandle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!msgHandle.trim() || !msgBody.trim() || sending) return;
    setSending(true);
    await sendMessage(msgHandle.trim(), msgBody.trim());
    setSending(false);
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setMsgHandle("");
      setMsgBody("");
    }, 4000);
  };

  switch (tab) {
    case "data":
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>SYSTEM PROFILE</h2>
          <div className={styles.dataGrid}>
            <div className={styles.dataCard}>
              <div className={styles.dataLabel}>IDENTITY</div>
              <div className={styles.dataValue}>Ben Dechrai</div>
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
          <h2 className={styles.sectionTitle} style={{ marginTop: "2rem" }}>NETWORK NODES</h2>
          <div className={styles.commsList}>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={styles.commsItem}>
              <span className={styles.commsLabel}>GITHUB</span>
              <span className={styles.commsValue}>github.com/bendechrai</span>
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={styles.commsItem}>
              <span className={styles.commsLabel}>LINKEDIN</span>
              <span className={styles.commsValue}>linkedin.com/in/bendechrai</span>
            </a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className={styles.commsItem}>
              <span className={styles.commsLabel}>SIGNAL</span>
              <span className={styles.commsValue}>twitter.com/bendechrai</span>
            </a>
          </div>
        </div>
      );
    case "comms":
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>ENCRYPTED RELAY</h2>
          {msgSent ? (
            <div className={styles.msgSent}>
              <div className={styles.msgSentIcon}>&#x25C8;</div>
              <p>TRANSMISSION ENCRYPTED &amp; DISPATCHED</p>
              <p className={styles.msgSentSub}>Routing through darknet relay nodes...</p>
              <p className={styles.msgSentSub}>Ben will decrypt your message shortly.</p>
            </div>
          ) : (
            <div className={styles.msgForm}>
              <div className={styles.msgField}>
                <label className={styles.msgLabel}>HANDLE / ALIAS</label>
                <input
                  type="text"
                  value={msgHandle}
                  onChange={(e) => setMsgHandle(e.target.value)}
                  className={styles.msgInput}
                  placeholder="your.handle"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div className={styles.msgField}>
                <label className={styles.msgLabel}>TRANSMISSION</label>
                <textarea
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className={styles.msgTextarea}
                  placeholder="Enter encrypted message..."
                  rows={4}
                  spellCheck={false}
                />
              </div>
              <button
                className={styles.msgSendBtn}
                onClick={handleSend}
                disabled={!msgHandle.trim() || !msgBody.trim() || sending}
              >
                {sending ? "ENCRYPTING..." : "TRANSMIT \u25B6"}
              </button>
            </div>
          )}
        </div>
      );
    case "events":
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>UPCOMING EVENTS</h2>
          <div className={styles.commsList}>
            {EVENTS.map((ev) => (
              <div key={ev.name} className={styles.commsItem}>
                <span className={styles.commsLabel}>
                  {ev.role === "workshop" ? "WKSHP" : ev.role === "speaking" ? "SPEAK" : "ATND"}
                </span>
                <div>
                  <div className={styles.commsValue}>{ev.name}</div>
                  <div className={styles.commsDetail}>{formatDate(ev.date)} &mdash; {ev.location}</div>
                  {ev.talk && <div className={styles.commsDetail}>&gt; {ev.talk}</div>}
                </div>
              </div>
            ))}
          </div>
          <h2 className={styles.sectionTitle} style={{ marginTop: "2rem" }}>TALKS &amp; WORKSHOPS</h2>
          <div className={styles.commsList}>
            {TALKS.map((t) => (
              <div key={t.title} className={styles.commsItem}>
                <span className={styles.commsLabel}>
                  {t.type === "workshop" ? "WKSHP" : "TALK"}
                </span>
                <div>
                  <div className={styles.commsValue}>{t.title}</div>
                  <div className={styles.commsDetail}>{t.event} &mdash; {formatDate(t.date)}</div>
                  <div className={styles.commsDetail}>{t.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "archives": {
      if (articleSlug) {
        const article = getArticleBySlug(articleSlug);
        if (article) {
          return (
            <div className={styles.contentSection}>
              <button className={styles.commsLabel} onClick={() => navigate("/articles")} style={{ cursor: "pointer", background: "none", border: "none", marginBottom: "1rem" }}>
                &lt; BACK TO ARCHIVES
              </button>
              <h2 className={styles.sectionTitle}>{article.title}</h2>
              <div className={styles.commsDetail} style={{ marginBottom: "1rem" }}>{formatDate(article.date)}</div>
              <p style={{ color: "#e0e0ff", lineHeight: 1.6 }}>{article.summary}</p>
            </div>
          );
        }
      }
      return (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>ARCHIVED DATA</h2>
          <div className={styles.commsList}>
            {ARTICLES.map((a) => (
              <div key={a.slug} className={styles.commsItem} onClick={() => navigate(`/articles/${a.slug}`)} style={{ cursor: "pointer" }}>
                <span className={styles.commsLabel}>{formatDate(a.date).replace(/ /g, "\u00A0")}</span>
                <div>
                  <div className={styles.commsValue}>{a.title}</div>
                  <div className={styles.commsDetail}>{a.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}

export default function CyberpunkTheme() {
  const { setTheme } = useTheme();
  const { section, articleSlug, navigate } = useSection();
  const activeTab = sectionToTab(section);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "DARKNET OS v4.2.1 — Unauthorized access will be prosecuted.",
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
        const valid = ["starship", "cyberpunk", "terminal", "holographic", "retro"];
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
        navigate("/articles");
        setTerminalLines((prev) => [...prev, "  Switching to ARCHIVES..."]);
      } else if (trimmed === "events") {
        navigate("/events");
        setTerminalLines((prev) => [...prev, "  Switching to EVENTS..."]);
      } else if (["talks"].includes(trimmed)) {
        navigate("/events");
        setTerminalLines((prev) => [...prev, "  Switching to EVENTS..."]);
      } else if (["contact", "comms"].includes(trimmed)) {
        navigate("/contact");
        setTerminalLines((prev) => [...prev, "  Switching to COMMS..."]);
      } else if (trimmed === "home" || trimmed === "data") {
        navigate("/");
        setTerminalLines((prev) => [...prev, "  Switching to DATA..."]);
      } else if (trimmed !== "") {
        setTerminalLines((prev) => [
          ...prev,
          `  Command not found: ${cmd}`,
        ]);
      }
    },
    [setTheme, navigate],
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
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.tabContent} role="tabpanel">
          <TabContent tab={activeTab} articleSlug={articleSlug} navigate={navigate} />
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
