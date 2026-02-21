"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, PROJECTS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
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
    case "projects": return "perf";
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
    case "perf": return "/projects";
    case "atcComm": return "/contact";
    default: return "/";
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

// ============ Row type for 6-row screen layout ============

interface ScreenRowData {
  leftLabel?: string;
  rightLabel?: string;
  leftData?: string;
  rightData?: string;
  leftColor?: "green" | "white" | "cyan" | "amber" | "magenta";
  rightColor?: "green" | "white" | "cyan" | "amber" | "magenta";
  leftSmall?: boolean;
  rightSmall?: boolean;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftHref?: string;
  rightHref?: string;
}

const colorClass = (c?: string) => {
  switch (c) {
    case "green": return styles.dataGreen;
    case "white": return styles.dataWhite;
    case "cyan": return styles.dataCyan;
    case "amber": return styles.dataAmber;
    case "magenta": return styles.dataMagenta;
    default: return styles.dataGreen;
  }
};

// Render 6 row pairs as flat grid cells (4 cells per pair: label-left, label-right, data-left, data-right)
function ScreenRows({ rows }: { rows: ScreenRowData[] }) {
  const padded = [...rows];
  while (padded.length < 6) padded.push({});

  return (
    <>
      {padded.slice(0, 6).map((row, i) => (
        <div key={i} className={styles.rowPair}>
          {/* Label left */}
          <div className={`${styles.cell} ${styles.cellLeft}`}>
            <span className={`${styles.label} ${row.onLeftClick ? styles.labelAmber : ""}`}>
              {row.leftLabel || "\u00A0"}
            </span>
          </div>
          {/* Label right */}
          <div className={`${styles.cell} ${styles.cellRight}`}>
            <span className={`${styles.label} ${row.onRightClick ? styles.labelAmber : ""}`}>
              {row.rightLabel || "\u00A0"}
            </span>
          </div>
          {/* Data left */}
          <div className={`${styles.cell} ${styles.cellLeft}`}>
            {row.leftHref ? (
              <a href={row.leftHref} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <span className={colorClass(row.leftColor)}>{row.leftData || "\u00A0"}</span>
              </a>
            ) : (
              <span
                className={`${colorClass(row.leftColor)} ${row.onLeftClick ? styles.lskData : ""}`}
                onClick={row.onLeftClick}
              >
                {row.leftData || "\u00A0"}
              </span>
            )}
          </div>
          {/* Data right */}
          <div className={`${styles.cell} ${styles.cellRight}`}>
            {row.rightHref ? (
              <a href={row.rightHref} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <span className={colorClass(row.rightColor)}>{row.rightData || "\u00A0"}</span>
              </a>
            ) : (
              <span
                className={`${colorClass(row.rightColor)} ${row.onRightClick ? styles.lskData : ""}`}
                onClick={row.onRightClick}
              >
                {row.rightData || "\u00A0"}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

// ============ Page builders ============

function buildInitRows(navigate: (p: string) => void): ScreenRowData[] {
  return [
    { leftLabel: "OPERATOR", rightLabel: "STATUS", leftData: "BEN DECHRAI", leftColor: "cyan", rightData: "ACTIVE", rightColor: "green" },
    { leftLabel: "ROLE", rightLabel: "BASE", leftData: "DEV / SPEAKER", leftColor: "cyan", rightData: "KMCI", rightColor: "green" },
    { leftLabel: "CODE ARCHIVE", leftData: "github.com/bendechrai", leftColor: "cyan", leftHref: SOCIAL_LINKS.github },
    { leftLabel: "NETWORK", leftData: "linkedin.com/in/bendechrai", leftColor: "cyan", leftHref: SOCIAL_LINKS.linkedin },
    { leftLabel: "TWITTER", leftData: "twitter.com/bendechrai", leftColor: "cyan", leftHref: SOCIAL_LINKS.twitter },
    { rightLabel: "ATC COMM >", rightData: "SEND MSG", rightColor: "amber", onRightClick: () => navigate("/contact") },
  ];
}

function buildFPlnListRows(page: number, navigate: (p: string) => void): { rows: ScreenRowData[]; totalPages: number } {
  const perPage = 6;
  const totalPages = Math.ceil(ARTICLES.length / perPage);
  const start = page * perPage;
  const slice = ARTICLES.slice(start, start + perPage);
  const rows: ScreenRowData[] = slice.map((a) => ({
    leftLabel: formatDate(a.date),
    leftData: a.title,
    leftColor: "green" as const,
    onLeftClick: () => navigate(`/articles/${a.slug}`),
  }));
  return { rows, totalPages };
}

function buildArticleDetailRows(slug: string, navigate: (p: string) => void, bodyPage: number): { rows: ScreenRowData[]; totalPages: number } {
  const article = getArticleBySlug(slug);
  if (!article) return { rows: [], totalPages: 1 };

  if (bodyPage === 0) {
    // First page: metadata
    return {
      rows: [
        { leftLabel: "< RETURN", leftData: "F-PLN LIST", leftColor: "amber", onLeftClick: () => navigate("/articles") },
        { leftLabel: "TITLE", leftData: article.title, leftColor: "white" },
        { leftLabel: "DATE", leftData: formatDate(article.date), leftColor: "green" },
        { leftLabel: "SUMMARY", leftData: article.summary, leftColor: "green", leftSmall: true },
        {},
        { rightLabel: "FULL TEXT >", rightData: "NEXT", rightColor: "amber" },
      ],
      totalPages: 1 + Math.ceil((article.body || "").split("\n\n").length / 3),
    };
  }

  // Body pages: 3 paragraphs per page in rows 1-3, back on L1, prev/next on row 6
  const paragraphs = (article.body || "").split("\n\n").filter(Boolean);
  const perPage = 3;
  const totalBodyPages = Math.ceil(paragraphs.length / perPage);
  const totalPages = 1 + totalBodyPages;
  const bodyIdx = bodyPage - 1;
  const slice = paragraphs.slice(bodyIdx * perPage, bodyIdx * perPage + perPage);

  const rows: ScreenRowData[] = slice.map((p, i) => ({
    leftData: p,
    leftColor: "green" as const,
    leftSmall: true,
  }));

  // Pad to 5 then add navigation row at 6
  while (rows.length < 5) rows.push({});
  rows.push({
    leftLabel: bodyPage > 1 ? "< PREV" : "< RETURN",
    leftColor: "amber",
    leftData: bodyPage > 1 ? "PREV PAGE" : "F-PLN LIST",
    onLeftClick: () => {}, // handled via LSK in parent
    rightLabel: bodyIdx < totalBodyPages - 1 ? "NEXT >" : undefined,
    rightData: bodyIdx < totalBodyPages - 1 ? "NEXT PAGE" : undefined,
    rightColor: "amber",
    onRightClick: bodyIdx < totalBodyPages - 1 ? () => {} : undefined, // handled via LSK
  });

  return { rows, totalPages };
}

function buildProgRows(page: number): { rows: ScreenRowData[]; totalPages: number } {
  const perPage = 3; // 2 rows per event (name+date, talk)
  const totalPages = Math.ceil(EVENTS.length / perPage);
  const start = page * perPage;
  const slice = EVENTS.slice(start, start + perPage);
  const rows: ScreenRowData[] = [];
  for (const ev of slice) {
    rows.push({
      leftLabel: ev.role === "workshop" ? "WKSHP" : ev.role === "speaking" ? "SPEAK" : "ATND",
      rightLabel: ev.location,
      leftData: ev.name,
      leftColor: "green",
      rightData: formatDate(ev.date),
      rightColor: "magenta",
    });
    if (ev.talk) {
      rows.push({
        leftData: ev.talk,
        leftColor: "white",
        leftSmall: true,
      });
    }
  }
  return { rows: rows.slice(0, 6), totalPages };
}

function buildDataRows(page: number): { rows: ScreenRowData[]; totalPages: number } {
  const perPage = 3; // ~2 rows per talk
  const totalPages = Math.ceil(TALKS.length / perPage);
  const start = page * perPage;
  const slice = TALKS.slice(start, start + perPage);
  const rows: ScreenRowData[] = [];
  for (const t of slice) {
    rows.push({
      leftLabel: t.type === "workshop" ? "WORKSHOP" : "TALK",
      rightLabel: formatDate(t.date),
      leftData: t.title,
      leftColor: "green",
    });
    rows.push({
      leftData: `${t.event} - ${t.description}`,
      leftColor: "green",
      leftSmall: true,
    });
  }
  return { rows: rows.slice(0, 6), totalPages };
}

function buildPerfRows(page: number): { rows: ScreenRowData[]; totalPages: number } {
  const perPage = 3; // ~2 rows per project
  const totalPages = Math.ceil(PROJECTS.length / perPage);
  const start = page * perPage;
  const slice = PROJECTS.slice(start, start + perPage);
  const rows: ScreenRowData[] = [];
  for (const p of slice) {
    rows.push({
      leftLabel: p.category.toUpperCase(),
      rightLabel: p.status.toUpperCase(),
      leftData: p.name,
      leftColor: "green",
      rightData: p.tech.slice(0, 2).join("/"),
      rightColor: "cyan",
      leftHref: p.url,
    });
    rows.push({
      leftData: p.tagline,
      leftColor: "white",
      leftSmall: true,
    });
  }
  return { rows: rows.slice(0, 6), totalPages };
}

// ============ ATC COMM page (special - has message form) ============

function AtcCommRows({
  name,
  message,
  msgSent,
  onSend,
  sending,
}: {
  name: string;
  message: string;
  msgSent: boolean;
  onSend: () => void;
  sending: boolean;
}) {
  if (msgSent) {
    return (
      <ScreenRows rows={[
        {},
        { leftData: "UPLINK SENT", leftColor: "green" },
        { leftData: "MESSAGE TRANSMITTED VIA ACARS", leftColor: "white", leftSmall: true },
        { leftData: "DELIVERY CONFIRMED", leftColor: "white", leftSmall: true },
        {},
        {},
      ]} />
    );
  }

  return (
    <ScreenRows rows={[
      { leftLabel: "FROM", leftData: name || "\u00A0", leftColor: name ? "cyan" : "amber", onLeftClick: () => {} },
      { leftLabel: "MESSAGE", leftData: message ? message.slice(0, 30) + (message.length > 30 ? "..." : "") : "\u00A0", leftColor: message ? "cyan" : "amber", onLeftClick: () => {} },
      { leftLabel: message.length > 30 ? "MSG CONT" : undefined, leftData: message.length > 30 ? message.slice(30, 80) + (message.length > 80 ? "..." : "") : undefined, leftColor: "green" },
      { leftData: !name ? "TYPE IN SCRATCHPAD, PRESS L1" : !message ? "TYPE IN SCRATCHPAD, PRESS L2" : undefined, leftColor: "white" },
      {},
      {
        rightLabel: sending ? "TRANSMITTING" : name.trim() && message.trim() ? "SEND *" : undefined,
        rightData: name.trim() && message.trim() && !sending ? "TRANSMIT" : undefined,
        rightColor: "amber",
        onRightClick: name.trim() && message.trim() && !sending ? onSend : undefined,
      },
    ]} />
  );
}

// ============ Physical MCDU Keyboard ============

function MCDUKeyboard({ onKey, onClear, onSpace }: {
  onKey: (key: string) => void;
  onClear: () => void;
  onSpace: () => void;
}) {
  const alphaRows = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O"],
    ["P", "Q", "R", "S", "T"],
    ["U", "V", "W", "X", "Y"],
    ["Z", "SP", "/", "CLR", "OVFY"],
  ];
  const compassKeys = new Set(["E", "N", "S", "W"]);

  const numRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "+/-"],
  ];

  const handleAlphaKey = (k: string) => {
    if (k === "SP") onSpace();
    else if (k === "CLR") onClear();
    else if (k === "OVFY") onKey(".");
    else if (k === "/") onKey("/");
    else onKey(k);
  };

  return (
    <>
      <div className={styles.numericArea}>
        {numRows.map((row, ri) => (
          <div key={ri} className={styles.numRow}>
            {row.map((k) => (
              <button
                key={k}
                className={`${styles.key} ${styles.keyNum} ${k === "+/-" ? styles.keySpecial : ""}`}
                onClick={() => onKey(k === "+/-" ? "-" : k)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.alphaKeys}>
        {alphaRows.map((row, ri) => (
          <div key={ri} className={styles.alphaRow}>
            {row.map((k) => (
              <button
                key={k}
                className={`${styles.key} ${styles.keyAlpha} ${compassKeys.has(k) ? styles.keyCompass : ""} ${k === "CLR" ? styles.keyClear : ""} ${["SP", "/", "CLR", "OVFY"].includes(k) ? styles.keySpecial : ""}`}
                onClick={() => handleAlphaKey(k)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
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
  const [screenOnly, setScreenOnly] = useState(false);

  // Pagination per page type
  const [listPage, setListPage] = useState(0);
  const [detailPage, setDetailPage] = useState(0);

  // Reset pagination when page changes
  useEffect(() => {
    setListPage(0);
    setDetailPage(0);
  }, [activePage, articleSlug]);

  // COMMS page state
  const [msgName, setMsgName] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!initializedRef.current && section !== "home") {
      initializedRef.current = true;
    }
  }, [section]);

  // Handle scratchpad commands
  const handleScratchCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (["articles", "f-pln", "fpln", "log"].includes(trimmed)) navigate("/articles");
      else if (["events", "prog", "departures"].includes(trimmed)) navigate("/events");
      else if (["talks", "data", "nav"].includes(trimmed)) navigate("/talks");
      else if (["projects", "perf"].includes(trimmed)) navigate("/projects");
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

  // Keyboard key press routing — always writes to scratchpad
  const handleKeyPress = useCallback(
    (key: string) => {
      setScratchpad((prev) => prev + key);
    },
    [],
  );

  const handleKeyClear = useCallback(() => {
    setScratchpad((prev) => prev.slice(0, -1));
  }, []);

  const handleKeySpace = useCallback(() => {
    setScratchpad((prev) => prev + " ");
  }, []);

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

  // Build current page content
  let screenRows: ScreenRowData[] = [];
  let screenTitle = "";
  let pageNum = 1;
  let totalPages = 1;

  if (activePage === "init") {
    screenTitle = "INIT";
    screenRows = buildInitRows(navigate);
  } else if (activePage === "fPln" && articleSlug) {
    const result = buildArticleDetailRows(articleSlug, navigate, detailPage);
    screenTitle = detailPage === 0 ? "F-PLN DETAIL" : `F-PLN DETAIL`;
    screenRows = result.rows;
    totalPages = result.totalPages;
    pageNum = detailPage + 1;
  } else if (activePage === "fPln") {
    const result = buildFPlnListRows(listPage, navigate);
    screenTitle = "F-PLN";
    screenRows = result.rows;
    totalPages = result.totalPages;
    pageNum = listPage + 1;
  } else if (activePage === "prog") {
    const result = buildProgRows(listPage);
    screenTitle = "PROG";
    screenRows = result.rows;
    totalPages = result.totalPages;
    pageNum = listPage + 1;
  } else if (activePage === "data") {
    const result = buildDataRows(listPage);
    screenTitle = "DATA";
    screenRows = result.rows;
    totalPages = result.totalPages;
    pageNum = listPage + 1;
  } else if (activePage === "perf") {
    const result = buildPerfRows(listPage);
    screenTitle = "PERF";
    screenRows = result.rows;
    totalPages = result.totalPages;
    pageNum = listPage + 1;
  } else if (activePage === "atcComm") {
    screenTitle = "ATC COMM";
  }

  // Scratchpad error message state
  const [scratchError, setScratchError] = useState("");
  const scratchErrorTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showScratchError = useCallback((msg: string) => {
    setScratchError(msg);
    if (scratchErrorTimer.current) clearTimeout(scratchErrorTimer.current);
    scratchErrorTimer.current = setTimeout(() => setScratchError(""), 2000);
  }, []);

  // Handle LSK presses - delegates to the row's onClick
  const handleLsk = useCallback(
    (side: "left" | "right", row: number) => {
      if (activePage === "atcComm") {
        // L1: load scratchpad into FROM field
        if (side === "left" && row === 1) {
          if (scratchpad.trim()) {
            setMsgName(scratchpad.trim());
            setScratchpad("");
          } else {
            showScratchError("ENTRY REQUIRED");
          }
        }
        // L2: load scratchpad into MESSAGE field
        else if (side === "left" && row === 2) {
          if (scratchpad.trim()) {
            setMsgBody(scratchpad.trim());
            setScratchpad("");
          } else {
            showScratchError("ENTRY REQUIRED");
          }
        }
        // R6: transmit
        else if (side === "right" && row === 6) handleSendMessage();
        return;
      }

      // For article detail body pages, handle prev/next on row 6
      if (activePage === "fPln" && articleSlug && detailPage > 0) {
        if (row === 6 && side === "left") {
          // Prev page or return
          if (detailPage > 1) setDetailPage((p) => p - 1);
          else setDetailPage(0);
          return;
        }
        if (row === 6 && side === "right") {
          // Next page
          const paragraphs = (getArticleBySlug(articleSlug)?.body || "").split("\n\n").filter(Boolean);
          const totalBodyPages = Math.ceil(paragraphs.length / 3);
          if (detailPage - 1 < totalBodyPages - 1) setDetailPage((p) => p + 1);
          return;
        }
        return;
      }

      // For article detail page 0, row 6 right = go to body
      if (activePage === "fPln" && articleSlug && detailPage === 0 && row === 6 && side === "right") {
        setDetailPage(1);
        return;
      }

      const idx = row - 1;
      if (idx >= 0 && idx < screenRows.length) {
        const r = screenRows[idx];
        if (side === "left" && r.onLeftClick) r.onLeftClick();
        else if (side === "right" && r.onRightClick) r.onRightClick();
      }
    },
    [activePage, articleSlug, detailPage, screenRows, handleSendMessage, scratchpad, showScratchError],
  );

  // Slew keys for pagination - use ref for totalPages to avoid stale closures
  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  const handleSlewUp = useCallback(() => {
    if (articleSlug) {
      setDetailPage((p) => Math.max(0, p - 1));
    } else {
      setListPage((p) => Math.max(0, p - 1));
    }
  }, [articleSlug]);

  const handleSlewDown = useCallback(() => {
    const tp = totalPagesRef.current;
    if (articleSlug) {
      setDetailPage((p) => p < tp - 1 ? p + 1 : p);
    } else {
      setListPage((p) => p < tp - 1 ? p + 1 : p);
    }
  }, [articleSlug]);

  const handlePageKey = useCallback(
    (page: McduPage) => {
      navigate(pageToPath(page));
    },
    [navigate],
  );

  const pageKeysRow1 = [
    { id: "dir" as const, label: "DIR", page: null },
    { id: "prog" as const, label: "PROG", page: "prog" as McduPage },
    { id: "perf" as const, label: "PERF", page: "perf" as McduPage },
    { id: "init" as const, label: "INIT", page: "init" as McduPage },
    { id: "data" as const, label: "DATA", page: "data" as McduPage },
    { id: "radnav" as const, label: "RAD\nNAV", page: null },
  ];
  const pageKeysRow2 = [
    { id: "fpln" as const, label: "F-PLN", page: "fPln" as McduPage },
    { id: "fuelpred" as const, label: "FUEL\nPRED", page: null },
    { id: "secfpln" as const, label: "SEC\nF-PLN", page: null },
    { id: "atccomm" as const, label: "ATC\nCOMM", page: "atcComm" as McduPage },
    { id: "mcdumenu" as const, label: "MCDU\nMENU", page: "init" as McduPage },
    { id: "airport" as const, label: "AIR\nPORT", page: null },
  ];

  // Screen-only reading mode: scrollable content without MCDU hardware
  if (screenOnly) {
    // Build all body content for current article or page
    const article = articleSlug ? getArticleBySlug(articleSlug) : null;

    return (
      <div className={styles.mcdu}>
        <div className={styles.readingMode}>
          <button className={styles.readingToggle} onClick={() => setScreenOnly(false)} aria-label="Back to MCDU view">
            MCDU
          </button>
          <div className={styles.readingScreen}>
            {article ? (
              <>
                <div className={styles.readingTitle}>{article.title}</div>
                <div className={styles.readingDate}>{formatDate(article.date)}</div>
                <div className={styles.readingSummary}>{article.summary}</div>
                {article.body && article.body.split("\n\n").map((para, i) => (
                  <p key={i} className={styles.readingPara}>{para}</p>
                ))}
                <button className={styles.readingBack} onClick={() => { navigate("/articles"); setScreenOnly(false); }}>
                  &lt; RETURN TO F-PLN
                </button>
              </>
            ) : (
              <>
                <div className={styles.readingTitle}>{screenTitle}</div>
                {screenRows.filter(r => r.leftData || r.rightData).map((row, i) => (
                  <div key={i} className={styles.readingRow}>
                    {row.leftLabel && <span className={styles.readingLabel}>{row.leftLabel}</span>}
                    {row.leftData && (
                      row.leftHref ? (
                        <a href={row.leftHref} target="_blank" rel="noopener noreferrer" className={styles.readingLink}>{row.leftData}</a>
                      ) : (
                        <span className={styles.readingData} onClick={row.onLeftClick} style={row.onLeftClick ? { cursor: "pointer" } : undefined}>{row.leftData}</span>
                      )
                    )}
                    {row.rightData && <span className={styles.readingData}>{row.rightData}</span>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mcdu}>
      {/* Cockpit surround wraps the MCDU; panels hidden on mobile via CSS */}
      <div className={styles.cockpit}>
        <div className={styles.cockpitTop}>
          <div className={styles.glareshield}>
            <span className={styles.cockpitLabel}>GLARESHIELD</span>
            <div className={styles.cockpitIndicators}>
              <span className={styles.indicatorGreen} />
              <span className={styles.indicatorAmber} />
              <span className={styles.indicatorGreen} />
            </div>
          </div>
        </div>
        <div className={styles.cockpitMiddle}>
          <div className={styles.cockpitPanel}>
            <span className={styles.cockpitLabel}>ECAM</span>
            <div className={styles.cockpitGauge} />
            <div className={styles.cockpitGauge} />
          </div>

          <div className={styles.unit}>
            {/* Toggle button */}
            <button className={styles.screenToggle} onClick={() => setScreenOnly(true)} aria-label="Switch to reading mode">
              RDR
            </button>

            {/* Annunciator strip */}
            <div className={styles.annunciators}>
              <span className={styles.annunciator}>FM1</span>
              <span className={styles.annunciator}>IND</span>
              <span className={`${styles.annunciator} ${styles.annunciatorActive}`}>RDY</span>
              <span className={styles.annunciator}>FM2</span>
            </div>

            {/* Screen area: title | LSKs+rows | scratchpad */}
            <div className={styles.screenArea}>
              {/* Screen background (dark bezel spanning full middle column) */}
              <div className={styles.screenBg} />

              {/* Title bar — no LSKs beside it */}
              <div className={styles.screenTitleArea}>
                <div className={styles.pageTitle}>
                  {screenTitle}
                </div>
                {totalPages > 1 && (
                  <span className={styles.pageArrow}>{pageNum}/{totalPages}</span>
                )}
              </div>

              {/* Left LSKs (L1-L6) — aligned with data rows */}
              <div className={styles.lskLeft}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button key={n} className={styles.lsk} onClick={() => handleLsk("left", n)} aria-label={`L${n}`}>
                    &lt;
                  </button>
                ))}
              </div>

              {/* 6 data rows */}
              <div className={styles.screenRowsArea}>
                {activePage === "atcComm" ? (
                  <AtcCommRows
                    name={msgName}
                    message={msgBody}
                    msgSent={msgSent}
                    onSend={handleSendMessage}
                    sending={sending}
                  />
                ) : (
                  <ScreenRows rows={screenRows} />
                )}
              </div>

              {/* Right LSKs (R1-R6) — aligned with data rows */}
              <div className={styles.lskRight}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button key={n} className={styles.lsk} onClick={() => handleLsk("right", n)} aria-label={`R${n}`}>
                    &gt;
                  </button>
                ))}
              </div>

              {/* Scratchpad — below L6/R6, no LSKs beside it */}
              <div className={styles.screenScratchArea} onClick={() => { if (!scratchError) scratchRef.current?.focus(); }}>
                {scratchError ? (
                  <span className={styles.scratchpadAmber}>{scratchError}</span>
                ) : (
                  <input
                    ref={scratchRef}
                    type="text"
                    inputMode="none"
                    value={scratchpad}
                    onChange={(e) => setScratchpad(e.target.value)}
                    onKeyDown={handleScratchKeyDown}
                    className={styles.scratchpadInput}
                    placeholder=""
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Scratchpad input"
                  />
                )}
              </div>
            </div>

            {/* Controls area: page keys (6×2), rocker, AIRPORT, arrows */}
            <nav className={styles.controlsArea} role="navigation" aria-label="FMS page navigation">
              {/* BRT/DIM rocker — col 7, rows 1-2 */}
              <div className={styles.rocker} style={{ gridColumn: 13, gridRow: "1 / 3" }}>
                <span className={styles.rockerLabel}>BRT</span>
                <span className={styles.rockerLabel}>DIM</span>
              </div>

              {/* Row 1: page keys */}
              {pageKeysRow1.map((pk) => (
                <button
                  key={pk.id}
                  className={`${styles.pageKey} ${pk.page === null ? styles.pageKeyDisabled : ""} ${pk.page !== null && activePage === pk.page ? styles.pageKeyActive : ""}`}
                  onClick={pk.page !== null ? () => handlePageKey(pk.page) : undefined}
                  disabled={pk.page === null}
                >
                  {pk.label}
                </button>
              ))}

              {/* Row 2: page keys */}
              {pageKeysRow2.map((pk) => (
                <button
                  key={pk.id}
                  className={`${styles.pageKey} ${pk.page === null ? styles.pageKeyDisabled : ""} ${pk.page !== null && activePage === pk.page ? styles.pageKeyActive : ""}`}
                  onClick={pk.page !== null ? () => handlePageKey(pk.page) : undefined}
                  disabled={pk.page === null}
                >
                  {pk.label}
                </button>
              ))}

              {/* Rows 3-4: arrow keys */}
              <button className={styles.arrowKey} onClick={handleSlewUp} style={{ gridColumn: '1 / span 2', gridRow: 3 }} aria-label="Previous page">&larr;</button>
              <button className={styles.arrowKey} onClick={handleSlewUp} style={{ gridColumn: '3 / span 2', gridRow: 3 }} aria-label="Previous page">&uarr;</button>
              <button className={styles.arrowKey} style={{ gridColumn: '1 / span 2', gridRow: 4 }} aria-label="Next page">&rarr;</button>
              <button className={styles.arrowKey} onClick={handleSlewDown} style={{ gridColumn: '3 / span 2', gridRow: 4 }} aria-label="Next page">&darr;</button>

              {/* Keyboard: numpad under arrows, alpha beside AIRPORT/arrows */}
              <MCDUKeyboard
                onKey={handleKeyPress}
                onClear={handleKeyClear}
                onSpace={handleKeySpace}
              />
            </nav>

          </div>

          <div className={styles.cockpitPanel}>
            <span className={styles.cockpitLabel}>RADIO</span>
            <div className={styles.cockpitGauge} />
            <div className={styles.cockpitGauge} />
          </div>
        </div>
        <div className={styles.cockpitBottom}>
          <span className={styles.cockpitLabel}>PEDESTAL</span>
          <div className={styles.cockpitIndicators}>
            <span className={styles.indicatorDim} />
            <span className={styles.indicatorDim} />
            <span className={styles.indicatorGreen} />
            <span className={styles.indicatorDim} />
          </div>
        </div>
      </div>
    </div>
  );
}
