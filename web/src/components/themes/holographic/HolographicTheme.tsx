"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";
import { useSection } from "@/hooks/useSection";
import styles from "./holographic.module.css";

type PanelId = "about" | "articles" | "events" | "talks" | "contact";

interface PanelConfig {
  id: PanelId;
  title: string;
  path: string;
}

const PANELS: PanelConfig[] = [
  { id: "about", title: "SYSTEM PROFILE", path: "/" },
  { id: "articles", title: "ARTICLES", path: "/articles" },
  { id: "events", title: "EVENTS", path: "/events" },
  { id: "talks", title: "TALKS", path: "/talks" },
  { id: "contact", title: "QUANTUM RELAY", path: "/contact" },
];

function sectionToPanelId(section: string): PanelId {
  switch (section) {
    case "articles": return "articles";
    case "events": return "events";
    case "talks": return "talks";
    case "contact": return "contact";
    default: return "about";
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function PanelContent({ id, articleSlug, navigate }: { id: PanelId; articleSlug: string | null; navigate: (p: string) => void }) {
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

  switch (id) {
    case "about":
      return (
        <>
          <div className={styles.dataLine}>
            <span className={styles.label}>IDENTITY</span>
            <span>Ben Dechrai</span>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>ROLE</span>
            <span>Developer &amp; Speaker</span>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>LOCATION</span>
            <span>Melbourne, AU</span>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>GITHUB</span>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={styles.holoLink}>
              github.com/bendechrai
            </a>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>LINKEDIN</span>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={styles.holoLink}>
              linkedin.com/in/bendechrai
            </a>
          </div>
          <div className={styles.dataLine}>
            <span className={styles.label}>TWITTER</span>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className={styles.holoLink}>
              twitter.com/bendechrai
            </a>
          </div>
        </>
      );
    case "articles": {
      if (articleSlug) {
        const article = getArticleBySlug(articleSlug);
        if (article) {
          return (
            <>
              <button className={styles.label} onClick={() => navigate("/articles")} style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                &lt; BACK TO ARTICLES
              </button>
              <div className={styles.dataLine} style={{ flexDirection: "column", gap: "0.25rem" }}>
                <span>{article.title}</span>
                <span className={styles.holoDetail}>{formatDate(article.date)}</span>
                <span className={styles.holoDetail} style={{ lineHeight: 1.6 }}>{article.summary}</span>
              </div>
            </>
          );
        }
      }
      return (
        <>
          {ARTICLES.map((a) => (
            <div key={a.slug} className={styles.dataLine} style={{ flexDirection: "column", gap: "0.25rem", cursor: "pointer" }} onClick={() => navigate(`/articles/${a.slug}`)}>
              <span className={styles.label}>{formatDate(a.date)}</span>
              <span>{a.title}</span>
              <span className={styles.holoDetail}>{a.summary}</span>
            </div>
          ))}
        </>
      );
    }
    case "events":
      return (
        <>
          {EVENTS.map((ev) => (
            <div key={ev.name} className={styles.dataLine} style={{ flexDirection: "column", gap: "0.25rem" }}>
              <span className={styles.label}>
                {ev.role === "workshop" ? "WORKSHOP" : ev.role === "speaking" ? "SPEAKING" : "ATTENDING"}
              </span>
              <span>{ev.name}</span>
              <span className={styles.holoDetail}>
                {formatDate(ev.date)} &mdash; {ev.location}
              </span>
              {ev.talk && <span className={styles.holoDetail}>{ev.talk}</span>}
            </div>
          ))}
        </>
      );
    case "talks":
      return (
        <>
          {TALKS.map((t) => (
            <div key={t.title} className={styles.dataLine} style={{ flexDirection: "column", gap: "0.25rem" }}>
              <span className={styles.label}>{t.type === "workshop" ? "WORKSHOP" : "TALK"}</span>
              <span>{t.title}</span>
              <span className={styles.holoDetail}>{t.event} &mdash; {formatDate(t.date)}</span>
              <span className={styles.holoDetail}>{t.description}</span>
            </div>
          ))}
        </>
      );
    case "contact":
      return (
        <>
          {msgSent ? (
            <div className={styles.holoMsgSent}>
              <p>QUANTUM RELAY TRANSMISSION COMPLETE</p>
              <p className={styles.holoDetail}>Entangled photon delivery confirmed. Ben will respond shortly.</p>
            </div>
          ) : (
            <div className={styles.holoMsgForm}>
              <div className={styles.holoField}>
                <span className={styles.label}>IDENTIFIER</span>
                <input
                  type="text"
                  value={msgHandle}
                  onChange={(e) => setMsgHandle(e.target.value)}
                  className={styles.holoInput}
                  placeholder="Your identity"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div className={styles.holoField}>
                <span className={styles.label}>MESSAGE</span>
                <textarea
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className={styles.holoTextarea}
                  placeholder="Compose transmission..."
                  rows={3}
                  spellCheck={false}
                />
              </div>
              <button
                className={styles.holoSendBtn}
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

function HoloPanel({
  config,
  visible,
  onDismiss,
  articleSlug,
  navigate,
}: {
  config: PanelConfig;
  visible: boolean;
  onDismiss: () => void;
  articleSlug: string | null;
  navigate: (p: string) => void;
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
        <PanelContent id={config.id} articleSlug={articleSlug} navigate={navigate} />
      </div>
    </div>
  );
}

export default function HolographicTheme() {
  const { setTheme } = useTheme();
  const { section, articleSlug, navigate } = useSection();
  const initialPanelId = sectionToPanelId(section);
  const [visiblePanels, setVisiblePanels] = useState<Set<PanelId>>(() => new Set([initialPanelId]));
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

  const togglePanelAndNavigate = useCallback((id: PanelId) => {
    const panel = PANELS.find((p) => p.id === id);
    setVisiblePanels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (panel) navigate(panel.path);
      }
      return next;
    });
  }, [navigate]);

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
      if (e.key === "/" && !paletteOpen && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
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
        action: () => { togglePanelAndNavigate(p.id); setPaletteOpen(false); },
      })),
      { label: "THEME STARSHIP", action: () => { setTheme("starship"); setPaletteOpen(false); } },
      { label: "THEME CYBERPUNK", action: () => { setTheme("cyberpunk"); setPaletteOpen(false); } },
      { label: "THEME TERMINAL", action: () => { setTheme("terminal"); setPaletteOpen(false); } },
      { label: "THEME HOLOGRAPHIC", action: () => { setTheme("holographic"); setPaletteOpen(false); } },
      { label: "THEME RETRO", action: () => { setTheme("retro"); setPaletteOpen(false); } },
      { label: "THEME FMS", action: () => { setTheme("fms"); setPaletteOpen(false); } },
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
            articleSlug={articleSlug}
            navigate={navigate}
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
