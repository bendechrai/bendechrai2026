"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, SOCIAL_LINKS } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";

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
  { id: "contact", label: "COMMS", color: "#cc6699" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function SectionContent({ section }: { section: Section }) {
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
    case "articles":
      return (
        <>
          <h2 className={styles.contentTitle}>PUBLISHED WRITINGS</h2>
          {ARTICLES.map((a) => (
            <div key={a.title} className={styles.dataRow}>
              <span className={styles.dataLabel}>{formatDate(a.date)}</span>
              <div>
                <span className={styles.dataValue}>{a.title}</span>
                <p className={styles.contentText}>{a.summary}</p>
              </div>
            </div>
          ))}
        </>
      );
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
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={styles.lcarsLink}>
              github.com/bendechrai
            </a>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>FEDERATION NET</span>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={styles.lcarsLink}>
              linkedin.com/in/bendechrai
            </a>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataLabel}>SUBSPACE FREQ</span>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className={styles.lcarsLink}>
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
                  className={styles.lcarsInput}
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
                  className={styles.lcarsTextarea}
                  placeholder="Enter subspace transmission..."
                  rows={4}
                  spellCheck={false}
                />
              </div>
              <button
                className={styles.lcarsSendBtn}
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
      else if (["contact", "4", "comms"].includes(trimmed)) setActiveSection("contact");
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
