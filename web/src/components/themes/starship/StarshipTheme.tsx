"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";
import { useSection } from "@/hooks/useSection";

const SYSTEM_TIME = (() => {
  const now = typeof performance !== "undefined" ? performance.timeOrigin : 0;
  return `T ${Math.floor(now / 86400000)}.${Math.floor((now % 86400000) / 8640000)}`;
})();
import styles from "./starship.module.css";

type StarshipSection = "articles" | "events" | "talks" | "contact";

function sectionFromUrl(section: string): StarshipSection {
  switch (section) {
    case "events": return "events";
    case "talks": return "talks";
    case "contact": return "contact";
    default: return "articles";
  }
}

const NAV_ITEMS: { id: StarshipSection; label: string; color: string; path: string }[] = [
  { id: "articles", label: "ARTICLES", color: "#ffaa00", path: "/articles" },
  { id: "events", label: "EVENTS", color: "#cc99ff", path: "/events" },
  { id: "talks", label: "TALKS", color: "#99ccff", path: "/talks" },
  { id: "contact", label: "COMMS", color: "#cc6699", path: "/contact" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function SectionContent({ section, articleSlug, navigate }: { section: StarshipSection; articleSlug: string | null; navigate: (p: string) => void }) {
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

  switch (section) {
    case "articles": {
      if (articleSlug) {
        const article = getArticleBySlug(articleSlug);
        if (article) {
          return (
            <>
              <button className={styles.dataLabel} onClick={() => navigate("/articles")} style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                &lt; BACK TO ARTICLES
              </button>
              <h2 className={styles.contentTitle}>{article.title}</h2>
              <p className={styles.contentText}>{formatDate(article.date)}</p>
              {article.image && <img src={article.image} alt="" className={styles.articleImage} />}
              <p className={styles.contentText} style={{ lineHeight: 1.6 }}>{article.summary}</p>
              {article.body && (
                <div className={styles.articleBody}>
                  {article.body.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </>
          );
        }
      }
      return (
        <>
          <h2 className={styles.contentTitle}>PUBLISHED WRITINGS</h2>
          {ARTICLES.map((a) => (
            <div key={a.slug} className={styles.dataRow} onClick={() => navigate(`/articles/${a.slug}`)} style={{ cursor: "pointer" }}>
              <span className={styles.dataLabel}>{formatDate(a.date)}</span>
              <div>
                <span className={styles.dataValue}>{a.title}</span>
                <p className={styles.contentText}>{a.summary}</p>
              </div>
            </div>
          ))}
        </>
      );
    }
    case "events":
      return (
        <>
          <h2 className={styles.contentTitle}>UPCOMING APPEARANCES</h2>
          {EVENTS.map((ev) => (
            <div key={ev.name} className={styles.dataRow}>
              <span className={styles.dataLabel}>
                {ev.role === "workshop" ? "WORKSHOP" : ev.role === "speaking" ? "SPEAKING" : "ATTENDING"}
              </span>
              <div>
                <span className={styles.dataValue}>{ev.name}</span>
                <p className={styles.contentText}>
                  {formatDate(ev.date)} &mdash; {ev.location}
                </p>
                {ev.talk && <p className={styles.contentText}>Presentation: {ev.talk}</p>}
              </div>
            </div>
          ))}
        </>
      );
    case "talks":
      return (
        <>
          <h2 className={styles.contentTitle}>TALKS &amp; WORKSHOPS</h2>
          {TALKS.map((t) => (
            <div key={t.title} className={styles.dataRow}>
              <span className={styles.dataLabel}>{t.type === "workshop" ? "WORKSHOP" : "TALK"}</span>
              <div>
                <span className={styles.dataValue}>{t.title}</span>
                <p className={styles.contentText}>{t.event} &mdash; {formatDate(t.date)}</p>
                <p className={styles.contentText}>{t.description}</p>
              </div>
            </div>
          ))}
        </>
      );
    case "contact":
      return (
        <>
          <h2 className={styles.contentTitle}>SUBSPACE COMMUNICATIONS</h2>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>CODE ARCHIVE</span>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={styles.themeLink}>
              github.com/bendechrai
            </a>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>FEDERATION NET</span>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={styles.themeLink}>
              linkedin.com/in/bendechrai
            </a>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>SUBSPACE FREQ</span>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className={styles.themeLink}>
              twitter.com/bendechrai
            </a>
          </div>

          <h2 className={styles.contentTitle} style={{ marginTop: "2rem" }}>OPEN CHANNEL</h2>
          {msgSent ? (
            <div className={styles.msgSent}>
              <p className={styles.contentText}>SUBSPACE TRANSMISSION COMPLETE</p>
              <p className={styles.contentText}>Message routed through relay station DS-7.</p>
              <p className={styles.contentText}>Expected delivery: immediate.</p>
            </div>
          ) : (
            <div className={styles.msgForm}>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>IDENTIFICATION</span>
                <input
                  type="text"
                  value={msgHandle}
                  onChange={(e) => setMsgHandle(e.target.value)}
                  className={styles.themeInput}
                  placeholder="Your designation"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>MESSAGE</span>
                <textarea
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className={styles.themeTextarea}
                  placeholder="Enter subspace transmission..."
                  rows={4}
                  spellCheck={false}
                />
              </div>
              <button
                className={styles.themeSendBtn}
                onClick={handleSend}
                disabled={!msgHandle.trim() || !msgBody.trim() || sending}
              >
                {sending ? "TRANSMITTING..." : "TRANSMIT"}
              </button>
            </div>
          )}
        </>
      );
  }
}

export default function StarshipTheme() {
  const { setTheme } = useTheme();
  const { section, articleSlug, navigate } = useSection();
  const activeSection = sectionFromUrl(section);
  const [commandInput, setCommandInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (["articles", "1"].includes(trimmed)) navigate("/articles");
      else if (["events", "2"].includes(trimmed)) navigate("/events");
      else if (["talks", "3"].includes(trimmed)) navigate("/talks");
      else if (["contact", "4", "comms"].includes(trimmed)) navigate("/contact");
      else if (trimmed.startsWith("theme ")) {
        const name = trimmed.slice(6).trim();
        const valid = ["starship", "cyberpunk", "terminal", "holographic", "retro", "fms"];
        if (valid.includes(name)) {
          setTimeout(() => setTheme(name as Parameters<typeof setTheme>[0]), 300);
        }
      }
    },
    [setTheme, navigate],
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
          <span className={styles.systemTime}>{SYSTEM_TIME}</span>
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
                onClick={() => navigate(item.path)}
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
          <SectionContent section={activeSection} articleSlug={articleSlug} navigate={navigate} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarLeft} />
        <div className={styles.commandArea} onClick={() => inputRef.current?.focus()}>
          <span className={styles.promptLabel}>BRIDGE &gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.commandInput}
            spellCheck={false}
            autoComplete="off"
            aria-label="Bridge command input"
          />
        </div>
      </div>
    </div>
  );
}
