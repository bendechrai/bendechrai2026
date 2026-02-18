"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";
import { useSection } from "@/hooks/useSection";
import styles from "./fms.module.css";

type FmsPage = "ident" | "flightlog" | "navdata" | "departures" | "comms";

function sectionToPage(section: string): FmsPage {
  switch (section) {
    case "articles": return "flightlog";
    case "events": return "departures";
    case "talks": return "navdata";
    case "contact": return "comms";
    default: return "ident";
  }
}

const NAV_ITEMS: { id: FmsPage; label: string; path: string }[] = [
  { id: "ident", label: "IDENT", path: "/" },
  { id: "flightlog", label: "F-LOG", path: "/articles" },
  { id: "departures", label: "DEPART", path: "/events" },
  { id: "navdata", label: "NAV", path: "/talks" },
  { id: "comms", label: "COMMS", path: "/contact" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

// Line Select Key indicator
function LSK({ side, active, onClick }: { side: "left" | "right"; active?: boolean; onClick?: () => void }) {
  const arrow = side === "left" ? "\u25C0" : "\u25B6";
  return (
    <div
      className={`${side === "left" ? styles.lskLeft : styles.lskRight} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      {onClick ? arrow : ""}
    </div>
  );
}

// A screen row with optional LSK buttons
function ScreenRow({
  children,
  onLeftClick,
  onRightClick,
  className,
}: {
  children: React.ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
}) {
  return (
    <div className={`${styles.screenRow} ${className || ""}`}>
      <LSK side="left" active={!!onLeftClick} onClick={onLeftClick} />
      <div className={styles.rowContent}>{children}</div>
      <LSK side="right" active={!!onRightClick} onClick={onRightClick} />
    </div>
  );
}

// IDENT page - like the aircraft identification page
function IdentPage() {
  return (
    <>
      <div className={styles.pageTitle}>IDENT</div>
      <ScreenRow>
        <div className={styles.fieldLabel}>OPERATOR</div>
        <div className={styles.fieldValueWhite}>BEN DECHRAI</div>
      </ScreenRow>
      <ScreenRow>
        <div className={styles.fieldLabel}>ROLE</div>
        <div className={styles.fieldValue}>DEVELOPER / SPEAKER</div>
      </ScreenRow>
      <ScreenRow>
        <div className={styles.fieldLabel}>BASE</div>
        <div className={styles.fieldValue}>MELBOURNE, AU</div>
      </ScreenRow>
      <ScreenRow>
        <div className={styles.fieldLabel}>STATUS</div>
        <div className={styles.fieldValue}>ACTIVE</div>
      </ScreenRow>
      <hr className={styles.divider} />
      <ScreenRow>
        <div className={styles.fieldLabel}>CODE REPO</div>
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={styles.socialRow}>
          <div className={styles.fieldValue}>github.com/bendechrai</div>
        </a>
      </ScreenRow>
      <ScreenRow>
        <div className={styles.fieldLabel}>NET LINK</div>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialRow}>
          <div className={styles.fieldValue}>linkedin.com/in/bendechrai</div>
        </a>
      </ScreenRow>
      <ScreenRow>
        <div className={styles.fieldLabel}>SIGNAL</div>
        <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialRow}>
          <div className={styles.fieldValue}>twitter.com/bendechrai</div>
        </a>
      </ScreenRow>
    </>
  );
}

// Flight Log page - Articles (like a pilot's logbook)
function FlightLogPage({ articleSlug, navigate }: { articleSlug: string | null; navigate: (p: string) => void }) {
  if (articleSlug) {
    const article = getArticleBySlug(articleSlug);
    if (article) {
      return (
        <>
          <div className={styles.pageTitle}>FLIGHT LOG ENTRY</div>
          <button className={styles.backBtn} onClick={() => navigate("/articles")}>
            &lt; RETURN TO LOG
          </button>
          <ScreenRow>
            <div className={styles.fieldValueWhite}>{article.title}</div>
          </ScreenRow>
          <ScreenRow>
            <div className={styles.fieldValueAmber}>{formatDate(article.date)}</div>
          </ScreenRow>
          <ScreenRow>
            <div className={styles.fieldValue} style={{ lineHeight: 1.6 }}>{article.summary}</div>
          </ScreenRow>
        </>
      );
    }
  }

  return (
    <>
      <div className={styles.pageTitle}>FLIGHT LOG</div>
      <div className={styles.contentArea}>
        {ARTICLES.map((a) => (
          <ScreenRow key={a.slug} onLeftClick={() => navigate(`/articles/${a.slug}`)} className={styles.rowClickable}>
            <div className={styles.articleItem} onClick={() => navigate(`/articles/${a.slug}`)}>
              <div className={styles.fieldValueWhite}>{a.title}</div>
              <div className={styles.fieldValueAmber}>{formatDate(a.date)}</div>
              <div className={styles.fieldLabel} style={{ marginTop: 2 }}>{a.summary}</div>
            </div>
          </ScreenRow>
        ))}
      </div>
    </>
  );
}

// Departures page - Events (like a departure board)
function DeparturesPage() {
  return (
    <>
      <div className={styles.pageTitle}>DEPARTURES</div>
      <div className={styles.contentArea}>
        {EVENTS.map((ev) => (
          <ScreenRow key={ev.name}>
            <div>
              <div className={styles.fieldValueWhite}>{ev.name}</div>
              <div className={styles.fieldValue}>
                {ev.role === "workshop" ? "WKSHP" : ev.role === "speaking" ? "SPEAK" : "ATND"}
                {" "}&mdash; {ev.location}
              </div>
              <div className={styles.fieldValueAmber}>{formatDate(ev.date)}</div>
              {ev.talk && <div className={styles.fieldLabel}>{ev.talk}</div>}
            </div>
          </ScreenRow>
        ))}
      </div>
    </>
  );
}

// Nav Data page - Talks (like navigation database)
function NavDataPage() {
  return (
    <>
      <div className={styles.pageTitle}>NAV DATA</div>
      <div className={styles.contentArea}>
        {TALKS.map((t) => (
          <ScreenRow key={t.title}>
            <div>
              <div className={styles.fieldValueWhite}>{t.title}</div>
              <div className={styles.fieldValue}>
                {t.type === "workshop" ? "WORKSHOP" : "TALK"}
              </div>
              <div className={styles.fieldValueAmber}>{t.event} &mdash; {formatDate(t.date)}</div>
              <div className={styles.fieldLabel} style={{ marginTop: 2 }}>{t.description}</div>
            </div>
          </ScreenRow>
        ))}
      </div>
    </>
  );
}

// MCDU Keyboard for message input
function MCDUKeyboard({
  onKey,
  onClear,
  onSend,
  sendDisabled,
  sending,
}: {
  onKey: (key: string) => void;
  onClear: () => void;
  onSend: () => void;
  sendDisabled: boolean;
  sending: boolean;
}) {
  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className={styles.keyboard}>
      {rows.map((row, ri) => (
        <div key={ri} className={styles.keyRow}>
          {row.map((k) => (
            <button key={k} className={styles.key} onClick={() => onKey(k)}>
              {k}
            </button>
          ))}
        </div>
      ))}
      <div className={styles.keyRow}>
        <button className={`${styles.key} ${styles.keyWide} ${styles.keyClear}`} onClick={onClear}>
          CLR
        </button>
        <button className={`${styles.key} ${styles.keyExtraWide}`} onClick={() => onKey(" ")}>
          SP
        </button>
        <button className={`${styles.key} ${styles.keyWide}`} onClick={() => onKey(".")}>
          .
        </button>
        <button className={`${styles.key} ${styles.keyWide}`} onClick={() => onKey("@")}>
          @
        </button>
        <button
          className={`${styles.key} ${styles.keyWide} ${styles.keySend}`}
          onClick={onSend}
          disabled={sendDisabled}
        >
          {sending ? "TX..." : "SEND"}
        </button>
      </div>
    </div>
  );
}

// Comms page - Contact with MCDU keyboard
function CommsPage() {
  const [activeField, setActiveField] = useState<"name" | "message">("name");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleKey = useCallback(
    (key: string) => {
      if (activeField === "name") {
        setName((prev) => prev + key);
      } else {
        setMessage((prev) => prev + key);
      }
    },
    [activeField],
  );

  const handleClear = useCallback(() => {
    if (activeField === "name") {
      setName((prev) => prev.slice(0, -1));
    } else {
      setMessage((prev) => prev.slice(0, -1));
    }
  }, [activeField]);

  const handleSend = useCallback(async () => {
    if (!name.trim() || !message.trim() || sending) return;
    setSending(true);
    await sendMessage(name.trim(), message.trim());
    setSending(false);
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setName("");
      setMessage("");
    }, 4000);
  }, [name, message, sending]);

  if (msgSent) {
    return (
      <>
        <div className={styles.pageTitle}>COMMS</div>
        <div className={styles.msgSent}>
          <div className={styles.msgSentTitle}>TRANSMISSION COMPLETE</div>
          <div className={styles.msgSentText}>Message routed via ACARS datalink.</div>
          <div className={styles.msgSentText}>Delivery confirmed. Standing by for reply.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.pageTitle}>COMMS</div>
      <div
        className={styles.msgFieldRow}
        onClick={() => setActiveField("name")}
        style={{ cursor: "pointer" }}
      >
        <span className={styles.msgLabel}>FROM:</span>
        <div className={`${styles.msgValue} ${activeField === "name" ? styles.msgValueActive : ""}`}>
          {name}<span style={{ opacity: activeField === "name" ? 1 : 0 }}>_</span>
        </div>
      </div>
      <div
        className={styles.msgFieldRow}
        onClick={() => setActiveField("message")}
        style={{ cursor: "pointer" }}
      >
        <span className={styles.msgLabel}>MSG:</span>
        <div className={`${styles.msgValue} ${activeField === "message" ? styles.msgValueActive : ""}`}>
          {message}<span style={{ opacity: activeField === "message" ? 1 : 0 }}>_</span>
        </div>
      </div>
      <MCDUKeyboard
        onKey={handleKey}
        onClear={handleClear}
        onSend={handleSend}
        sendDisabled={!name.trim() || !message.trim() || sending}
        sending={sending}
      />
    </>
  );
}

export default function FmsTheme() {
  const { setTheme } = useTheme();
  const { section, articleSlug, navigate } = useSection();
  const activePage = sectionToPage(section);
  const [scratchInput, setScratchInput] = useState("");
  const scratchRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // Auto-navigate on mount if URL has a section
  useEffect(() => {
    if (!initializedRef.current && section !== "home") {
      initializedRef.current = true;
    }
  }, [section]);

  const handleScratchCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (["articles", "flightlog", "f-log", "log"].includes(trimmed)) navigate("/articles");
      else if (["events", "departures", "depart"].includes(trimmed)) navigate("/events");
      else if (["talks", "nav", "navdata"].includes(trimmed)) navigate("/talks");
      else if (["contact", "comms", "msg"].includes(trimmed)) navigate("/contact");
      else if (["ident", "home", "id"].includes(trimmed)) navigate("/");
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

  const handleScratchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScratchCommand(scratchInput);
      setScratchInput("");
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "ident":
        return <IdentPage />;
      case "flightlog":
        return <FlightLogPage articleSlug={articleSlug} navigate={navigate} />;
      case "departures":
        return <DeparturesPage />;
      case "navdata":
        return <NavDataPage />;
      case "comms":
        return <CommsPage />;
    }
  };

  return (
    <div className={styles.mcdu}>
      <div className={styles.unit}>
        {/* Screen */}
        <div className={styles.screen}>
          {renderPage()}

          {/* Scratchpad - hidden on comms page since keyboard is there */}
          {activePage !== "comms" && (
            <div className={styles.scratchpad} onClick={() => scratchRef.current?.focus()}>
              <span className={styles.scratchpadLabel}>SPD:</span>
              <input
                ref={scratchRef}
                type="text"
                value={scratchInput}
                onChange={(e) => setScratchInput(e.target.value)}
                onKeyDown={handleScratchKeyDown}
                className={styles.scratchpadInput}
                placeholder="ENTER COMMAND"
                spellCheck={false}
                autoComplete="off"
                aria-label="Scratchpad input"
              />
            </div>
          )}
        </div>

        {/* Navigation buttons below screen */}
        <nav className={styles.lskBar} role="navigation" aria-label="FMS page navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.lskBtn} ${activePage === item.id ? styles.lskBtnActive : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
          <button
            className={styles.lskBtn}
            onClick={() => {
              const themes = ["starship", "cyberpunk", "terminal", "holographic", "retro", "fms"] as const;
              const idx = themes.indexOf("fms");
              const next = themes[(idx + 1) % themes.length];
              setTheme(next as Parameters<typeof setTheme>[0]);
            }}
          >
            THEME
          </button>
        </nav>
      </div>
    </div>
  );
}
