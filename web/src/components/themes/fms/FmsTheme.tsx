"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";
import { useSection } from "@/hooks/useSection";
import styles from "./fms.module.css";

// MCDU page IDs mapped to website sections
type McduPage = "init" | "fPln" | "data" | "prog" | "atcComm" | "perf";

function sectionToPage(section: string): McduPage {
  switch (section) {
    case "articles": return "fPln";
    case "events": return "prog";
    case "talks": return "data";
    case "contact": return "atcComm";
    default: return "init";
  }
}

function pageToPath(page: McduPage): string {
  switch (page) {
    case "init": return "/";
    case "fPln": return "/articles";
    case "prog": return "/events";
    case "data": return "/talks";
    case "atcComm": return "/contact";
    case "perf": return "/talks";
    default: return "/";
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

// ============ MCDU Screen Pages ============

// INIT page - like aircraft initialization
function InitPage({ onLsk }: { onLsk: (side: "left" | "right", row: number) => void }) {
  return (
    <>
      <div className={styles.pageTitle}>INIT</div>
      {/* Row 1: Operator / Status */}
      <div className={styles.labelRow}>
        <span className={styles.label}>OPERATOR</span>
        <span className={styles.label}>STATUS</span>
      </div>
      <div className={styles.screenRow}>
        <span className={`${styles.dataGreen} ${styles.lskData}`} onClick={() => onLsk("left", 1)}>BEN DECHRAI</span>
        <span className={styles.dataGreen}>ACTIVE</span>
      </div>
      {/* Row 2: Role / Base */}
      <div className={styles.labelRow}>
        <span className={styles.label}>ROLE</span>
        <span className={styles.label}>BASE</span>
      </div>
      <div className={styles.screenRow}>
        <span className={styles.dataGreen}>DEV / SPEAKER</span>
        <span className={styles.dataGreen}>YMML</span>
      </div>
      {/* Row 3: Code repo */}
      <div className={styles.labelRow}>
        <span className={styles.label}>CODE ARCHIVE</span>
      </div>
      <div className={styles.screenRow}>
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <span className={styles.dataCyan}>github.com/bendechrai</span>
        </a>
      </div>
      {/* Row 4: Network */}
      <div className={styles.labelRow}>
        <span className={styles.label}>NETWORK</span>
      </div>
      <div className={styles.screenRow}>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <span className={styles.dataCyan}>linkedin.com/in/bendechrai</span>
        </a>
      </div>
      {/* Row 5: Signal */}
      <div className={styles.labelRow}>
        <span className={styles.label}>SIGNAL</span>
      </div>
      <div className={styles.screenRow}>
        <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <span className={styles.dataCyan}>twitter.com/bendechrai</span>
        </a>
      </div>
      {/* Row 6: Nav to other pages */}
      <div className={styles.labelRow}>
        <span className={styles.label}> </span>
        <span className={`${styles.label} ${styles.labelAmber}`}>ATC COMM &gt;</span>
      </div>
      <div className={styles.screenRow}>
        <span> </span>
        <span className={`${styles.dataAmber} ${styles.lskData}`} onClick={() => onLsk("right", 6)}>SEND MSG</span>
      </div>
    </>
  );
}

// F-PLN page - Flight Plan = Articles
function FPlnPage({ articleSlug, navigate, onLsk }: { articleSlug: string | null; navigate: (p: string) => void; onLsk: (side: "left" | "right", row: number) => void }) {
  if (articleSlug) {
    const article = getArticleBySlug(articleSlug);
    if (article) {
      return (
        <>
          <div className={styles.pageTitle}>F-PLN DETAIL</div>
          <div className={styles.labelRow}>
            <span className={`${styles.label} ${styles.labelAmber}`}>&lt; RETURN</span>
          </div>
          <div className={styles.screenRow}>
            <span className={`${styles.dataAmber} ${styles.lskData}`} onClick={() => navigate("/articles")}>F-PLN LIST</span>
          </div>
          <div className={styles.labelRow}>
            <span className={styles.label}>TITLE</span>
          </div>
          <div className={styles.screenRow}>
            <span className={styles.dataWhite}>{article.title}</span>
          </div>
          <div className={styles.labelRow}>
            <span className={styles.label}>DATE</span>
          </div>
          <div className={styles.screenRow}>
            <span className={styles.dataGreen}>{formatDate(article.date)}</span>
          </div>
          <div className={styles.labelRow}>
            <span className={styles.label}>SUMMARY</span>
          </div>
          <div className={styles.screenRow}>
            <span className={`${styles.dataGreen} ${styles.dataSmall}`}>{article.summary}</span>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className={styles.pageTitle}>F-PLN</div>
      <div className={styles.contentArea}>
        {ARTICLES.map((a, i) => (
          <div key={a.slug}>
            <div className={styles.labelRow}>
              <span className={styles.label}>{formatDate(a.date)}</span>
            </div>
            <div className={styles.screenRow}>
              <span
                className={`${styles.dataGreen} ${styles.lskData}`}
                onClick={() => navigate(`/articles/${a.slug}`)}
              >
                {a.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// PROG page - Progress = Events
function ProgPage() {
  return (
    <>
      <div className={styles.pageTitle}>PROG</div>
      <div className={styles.contentArea}>
        {EVENTS.map((ev) => (
          <div key={ev.name}>
            <div className={styles.labelRow}>
              <span className={styles.label}>
                {ev.role === "workshop" ? "WKSHP" : ev.role === "speaking" ? "SPEAK" : "ATND"}
              </span>
              <span className={styles.label}>{ev.location}</span>
            </div>
            <div className={styles.screenRow}>
              <span className={styles.dataGreen}>{ev.name}</span>
              <span className={styles.dataMagenta}>{formatDate(ev.date)}</span>
            </div>
            {ev.talk && (
              <div className={styles.screenRow}>
                <span className={`${styles.dataWhite} ${styles.dataSmall}`}>{ev.talk}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// DATA page - Navigation Data = Talks
function DataPage() {
  return (
    <>
      <div className={styles.pageTitle}>DATA</div>
      <div className={styles.contentArea}>
        {TALKS.map((t) => (
          <div key={t.title}>
            <div className={styles.labelRow}>
              <span className={styles.label}>{t.type === "workshop" ? "WORKSHOP" : "TALK"}</span>
              <span className={styles.label}>{formatDate(t.date)}</span>
            </div>
            <div className={styles.screenRow}>
              <span className={styles.dataGreen}>{t.title}</span>
            </div>
            <div className={styles.screenRow}>
              <span className={`${styles.dataWhite} ${styles.dataSmall}`}>{t.event}</span>
            </div>
            <div className={styles.screenRow}>
              <span className={`${styles.dataGreen} ${styles.dataSmall}`} style={{ opacity: 0.7 }}>{t.description}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ATC COMM page - Contact / messaging with on-screen keyboard
function AtcCommPage({
  scratchpad,
  onScratchpadChange,
  activeField,
  setActiveField,
  name,
  setName,
  message,
  setMessage,
  msgSent,
  onSend,
  sending,
}: {
  scratchpad: string;
  onScratchpadChange: (v: string) => void;
  activeField: "name" | "message";
  setActiveField: (f: "name" | "message") => void;
  name: string;
  setName: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  msgSent: boolean;
  onSend: () => void;
  sending: boolean;
}) {
  if (msgSent) {
    return (
      <>
        <div className={styles.pageTitle}>ATC COMM</div>
        <div className={styles.msgSent}>
          <div className={styles.msgSentTitle}>UPLINK SENT</div>
          <div className={styles.msgSentText}>MESSAGE TRANSMITTED VIA ACARS</div>
          <div className={styles.msgSentText}>DELIVERY CONFIRMED</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.pageTitle}>ATC COMM</div>
      {/* Row 1: From field */}
      <div className={styles.labelRow}>
        <span className={styles.label}>FROM</span>
      </div>
      <div
        className={styles.msgFieldRow}
        onClick={() => setActiveField("name")}
      >
        <span className={`${styles.dataCyan} ${activeField === "name" ? styles.msgValueActive : ""}`}>
          {name || "[ ]"}<span style={{ opacity: activeField === "name" ? 1 : 0 }}>_</span>
        </span>
      </div>
      {/* Row 2-4: Message field */}
      <div className={styles.labelRow}>
        <span className={styles.label}>MESSAGE</span>
      </div>
      <div
        className={`${styles.msgTextValue} ${activeField === "message" ? styles.msgTextValueActive : ""}`}
        onClick={() => setActiveField("message")}
      >
        {message || "[ ]"}<span style={{ opacity: activeField === "message" ? 1 : 0 }}>_</span>
      </div>
      {/* Row 6: Send indicator */}
      <div className={styles.labelRow} style={{ marginTop: "auto" }}>
        <span> </span>
        <span className={`${styles.label} ${name.trim() && message.trim() ? styles.labelAmber : ""}`}>
          {sending ? "TRANSMITTING" : name.trim() && message.trim() ? "SEND *" : ""}
        </span>
      </div>
      <div className={styles.screenRow}>
        <span> </span>
        {name.trim() && message.trim() && !sending && (
          <span className={`${styles.dataAmber} ${styles.lskData}`} onClick={onSend}>TRANSMIT</span>
        )}
      </div>
    </>
  );
}

// ============ Physical MCDU Keyboard ============

function MCDUKeyboard({ onKey, onClear, onSpace }: {
  onKey: (key: string) => void;
  onClear: () => void;
  onSpace: () => void;
}) {
  // Alphabetical layout, not QWERTY
  const alphaRows = [
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O", "P", "Q", "R", "S"],
    ["T", "U", "V", "W", "X", "Y", "Z"],
  ];
  // E, N, S, W are compass keys (boxed on real MCDU)
  const compassKeys = new Set(["E", "N", "S", "W"]);

  const numRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "+/-"],
  ];

  return (
    <div className={styles.inputArea}>
      {/* Left: Alphabetical keys */}
      <div className={styles.alphaKeys}>
        {alphaRows.map((row, ri) => (
          <div key={ri} className={styles.alphaRow}>
            {row.map((k) => (
              <button
                key={k}
                className={`${styles.key} ${compassKeys.has(k) ? styles.keyCompass : ""}`}
                onClick={() => onKey(k)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
        {/* Special keys row */}
        <div className={styles.alphaRow}>
          <button className={`${styles.key} ${styles.keySpecial} ${styles.keySp}`} onClick={onSpace}>SP</button>
          <button className={`${styles.key} ${styles.keySpecial}`} onClick={() => onKey("/")}>/</button>
          <button className={`${styles.key} ${styles.keySpecial} ${styles.keyClear}`} onClick={onClear}>CLR</button>
          <button className={`${styles.key} ${styles.keySpecial}`} onClick={() => onKey(".")}>OVFY</button>
        </div>
      </div>

      {/* Right: Numeric keypad */}
      <div className={styles.numericArea}>
        {numRows.map((row, ri) => (
          <div key={ri} className={styles.numRow}>
            {row.map((k) => (
              <button
                key={k}
                className={`${styles.key} ${k === "+/-" ? styles.keySpecial : ""}`}
                onClick={() => onKey(k === "+/-" ? "-" : k)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Main FMS Theme ============

export default function FmsTheme() {
  const { setTheme } = useTheme();
  const { section, articleSlug, navigate } = useSection();
  const activePage = sectionToPage(section);
  const [scratchpad, setScratchpad] = useState("");
  const scratchRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // COMMS page state
  const [activeField, setActiveField] = useState<"name" | "message">("name");
  const [msgName, setMsgName] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!initializedRef.current && section !== "home") {
      initializedRef.current = true;
    }
  }, [section]);

  // Handle scratchpad commands (Enter on scratchpad)
  const handleScratchCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (["articles", "f-pln", "fpln", "log"].includes(trimmed)) navigate("/articles");
      else if (["events", "prog", "departures"].includes(trimmed)) navigate("/events");
      else if (["talks", "data", "nav"].includes(trimmed)) navigate("/talks");
      else if (["contact", "comms", "atc", "msg"].includes(trimmed)) navigate("/contact");
      else if (["init", "home", "ident"].includes(trimmed)) navigate("/");
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
      handleScratchCommand(scratchpad);
      setScratchpad("");
    }
  };

  // Handle keyboard key press (routes to scratchpad or COMMS fields)
  const handleKeyPress = useCallback(
    (key: string) => {
      if (activePage === "atcComm") {
        if (activeField === "name") {
          setMsgName((prev) => prev + key);
        } else {
          setMsgBody((prev) => prev + key);
        }
      } else {
        setScratchpad((prev) => prev + key);
        scratchRef.current?.focus();
      }
    },
    [activePage, activeField],
  );

  const handleKeyClear = useCallback(() => {
    if (activePage === "atcComm") {
      if (activeField === "name") {
        setMsgName((prev) => prev.slice(0, -1));
      } else {
        setMsgBody((prev) => prev.slice(0, -1));
      }
    } else {
      setScratchpad((prev) => prev.slice(0, -1));
    }
  }, [activePage, activeField]);

  const handleKeySpace = useCallback(() => {
    handleKeyPress(" ");
  }, [handleKeyPress]);

  const handleSendMessage = useCallback(async () => {
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
  }, [msgName, msgBody, sending]);

  // Handle LSK presses (mapped per page)
  const handleLsk = useCallback(
    (side: "left" | "right", row: number) => {
      if (activePage === "init" && side === "right" && row === 6) {
        navigate("/contact");
      }
    },
    [activePage, navigate],
  );

  // Navigate via page key
  const handlePageKey = useCallback(
    (page: McduPage) => {
      navigate(pageToPath(page));
    },
    [navigate],
  );

  // Page function keys - row 1 and row 2, matching real MCDU layout
  const pageKeysRow1 = [
    { id: "dir" as const, label: "DIR", page: "init" as McduPage },
    { id: "prog" as const, label: "PROG", page: "prog" as McduPage },
    { id: "perf" as const, label: "PERF", page: "data" as McduPage },
    { id: "init" as const, label: "INIT", page: "init" as McduPage },
    { id: "data" as const, label: "DATA", page: "data" as McduPage },
    { id: "fpln" as const, label: "F-PLN", page: "fPln" as McduPage },
  ];
  const pageKeysRow2 = [
    { id: "radnav" as const, label: "RAD\nNAV", page: "init" as McduPage },
    { id: "fuelpred" as const, label: "FUEL\nPRED", page: "init" as McduPage },
    { id: "secfpln" as const, label: "SEC\nF-PLN", page: "fPln" as McduPage },
    { id: "atccomm" as const, label: "ATC\nCOMM", page: "atcComm" as McduPage },
    { id: "mcdumenu" as const, label: "MCDU\nMENU", page: "init" as McduPage },
    { id: "airport" as const, label: "AIRPORT", page: "prog" as McduPage },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "init":
        return <InitPage onLsk={handleLsk} />;
      case "fPln":
        return <FPlnPage articleSlug={articleSlug} navigate={navigate} onLsk={handleLsk} />;
      case "prog":
        return <ProgPage />;
      case "data":
      case "perf":
        return <DataPage />;
      case "atcComm":
        return (
          <AtcCommPage
            scratchpad={scratchpad}
            onScratchpadChange={setScratchpad}
            activeField={activeField}
            setActiveField={setActiveField}
            name={msgName}
            setName={setMsgName}
            message={msgBody}
            setMessage={setMsgBody}
            msgSent={msgSent}
            onSend={handleSendMessage}
            sending={sending}
          />
        );
    }
  };

  return (
    <div className={styles.mcdu}>
      <div className={styles.unit}>
        {/* Annunciator strip */}
        <div className={styles.annunciators}>
          <span className={styles.annunciator}>FM1</span>
          <span className={styles.annunciator}>IND</span>
          <span className={`${styles.annunciator} ${styles.annunciatorActive}`}>RDY</span>
          <span className={styles.annunciator}>FM2</span>
        </div>

        {/* Screen area with LSKs on both sides */}
        <div className={styles.screenArea}>
          {/* Left LSKs (L1-L6) */}
          <div className={styles.lskColumn}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button key={n} className={styles.lsk} onClick={() => handleLsk("left", n)} aria-label={`L${n}`}>
                &lt;
              </button>
            ))}
          </div>

          {/* Screen */}
          <div className={styles.screen}>
            {renderPage()}
            {/* Scratchpad */}
            <div className={styles.scratchpad} onClick={() => scratchRef.current?.focus()}>
              <div className={styles.scratchpadBox}>
                <input
                  ref={scratchRef}
                  type="text"
                  value={scratchpad}
                  onChange={(e) => setScratchpad(e.target.value)}
                  onKeyDown={handleScratchKeyDown}
                  className={styles.scratchpadInput}
                  placeholder="[ ]"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Scratchpad input"
                />
              </div>
            </div>
          </div>

          {/* Right LSKs (R1-R6) */}
          <div className={styles.lskColumn}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button key={n} className={styles.lsk} onClick={() => handleLsk("right", n)} aria-label={`R${n}`}>
                &gt;
              </button>
            ))}
          </div>
        </div>

        {/* Page keys - Row 1: DIR, PROG, PERF, INIT, DATA, F-PLN */}
        <nav className={styles.pageKeys} role="navigation" aria-label="FMS page navigation">
          {pageKeysRow1.map((pk) => (
            <button
              key={pk.id}
              className={`${styles.pageKey} ${activePage === pk.page ? styles.pageKeyActive : ""}`}
              onClick={() => handlePageKey(pk.page)}
              style={{ whiteSpace: "pre-line" }}
            >
              {pk.label}
            </button>
          ))}
        </nav>

        {/* Page keys - Row 2: RAD NAV, FUEL PRED, SEC F-PLN, ATC COMM, MCDU MENU, AIRPORT */}
        <div className={styles.pageKeys}>
          {pageKeysRow2.map((pk) => (
            <button
              key={pk.id}
              className={`${styles.pageKey} ${activePage === pk.page ? styles.pageKeyActive : ""}`}
              onClick={() => handlePageKey(pk.page)}
              style={{ whiteSpace: "pre-line" }}
            >
              {pk.label}
            </button>
          ))}
        </div>

        {/* Slew keys */}
        <div className={styles.slewKeys}>
          <button className={styles.slewKey} aria-label="Slew left">&larr;</button>
          <button className={styles.slewKey} aria-label="Slew up">&uarr;</button>
          <button className={styles.slewKey} aria-label="Slew down">&darr;</button>
          <button className={styles.slewKey} aria-label="Slew right">&rarr;</button>
        </div>

        {/* Alphabetical keyboard + Numeric keypad */}
        <MCDUKeyboard
          onKey={handleKeyPress}
          onClear={handleKeyClear}
          onSpace={handleKeySpace}
        />

        {/* BRT / DIM */}
        <div className={styles.bottomControls}>
          <span className={styles.bottomBtn}>BRT</span>
          <span className={styles.bottomBtn}>DIM</span>
        </div>
      </div>
    </div>
  );
}
