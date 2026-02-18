"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ARTICLES, EVENTS, TALKS, SOCIAL_LINKS, getArticleBySlug } from "@/data/content";
import { sendMessage } from "@/lib/sendMessage";
import { useSection } from "@/hooks/useSection";
import styles from "./terminal.module.css";

interface TerminalLine {
  id: number;
  text: string;
  type: "output" | "input" | "header" | "separator" | "menu" | "ascii" | "link" | "image";
  href?: string;
  imageSrc?: string;
  onClick?: () => void;
}

const WELCOME_LINES: TerminalLine[] = [
  { id: 1, text: "SYSTEM v2.4.7", type: "header" },
  { id: 2, text: "BEN DECHRAI PERSONAL TERMINAL", type: "header" },
  { id: 3, text: "────────────────────────────────", type: "separator" },
  { id: 4, text: "", type: "output" },
  { id: 5, text: "Welcome to the personal terminal of Ben Dechrai.", type: "output" },
  { id: 6, text: "", type: "output" },
  { id: 7, text: "Available commands:", type: "output" },
  { id: 8, text: "", type: "output" },
  { id: 9, text: "  1) articles    - Published writings", type: "menu" },
  { id: 10, text: "  2) events      - Upcoming appearances", type: "menu" },
  { id: 11, text: "  3) talks       - Talks & workshops", type: "menu" },
  { id: 12, text: "  4) contact     - Subspace relay", type: "menu" },
  { id: 13, text: "  5) help        - Show this menu", type: "menu" },
  { id: 14, text: "  6) theme <n>   - Change visual theme", type: "menu" },
  { id: 15, text: "     read <n>    - Open article by number", type: "menu" },
  { id: 16, text: "", type: "output" },
  { id: 17, text: "Type a command or number to continue.", type: "output" },
  { id: 18, text: "", type: "output" },
];

type MessageStep = "idle" | "handle" | "body" | "confirm";

export default function TerminalTheme() {
  const { setTheme } = useTheme();
  const { section, articleSlug, navigate } = useSection();
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const nextIdRef = useRef(100);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [msgStep, setMsgStep] = useState<MessageStep>("idle");
  const [msgHandle, setMsgHandle] = useState("");
  const [msgBody, setMsgBody] = useState("");

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

  const addLines = useCallback(
    (newLines: (string | { text: string; href: string })[], type: TerminalLine["type"] = "output") => {
      const startId = nextIdRef.current;
      nextIdRef.current += newLines.length;
      setLines((old) => [
        ...old,
        ...newLines.map((item, i) => {
          if (typeof item === "string") {
            return { id: startId + i, text: item, type };
          }
          return { id: startId + i, text: item.text, type: "link" as const, href: item.href };
        }),
      ]);
    },
    [],
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
  };

  const showArticle = useCallback(
    (slug: string) => {
      const article = getArticleBySlug(slug);
      if (!article) {
        addLines(["", `  Article not found: ${slug}`, ""]);
        return;
      }
      const articleLines: string[] = [
        "",
        "── ARTICLE ───────────────",
        "",
        `  ${article.title}`,
        `  ${formatDate(article.date)}`,
        "",
        `  ${article.summary}`,
        "",
      ];
      if (article.body) {
        articleLines.push("  ──────────────────────────");
        articleLines.push("");
        for (const para of article.body.split("\n\n")) {
          articleLines.push(`  ${para}`);
          articleLines.push("");
        }
      }
      if (article.image) {
        const imgId = nextIdRef.current;
        nextIdRef.current += 1;
        setLines((old) => [
          ...old,
          { id: imgId, text: "", type: "image" as const, imageSrc: article.image },
        ]);
      }
      addLines(articleLines);
    },
    [addLines],
  );

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();

      // Handle message composition flow
      if (msgStep === "handle") {
        addLines([`> ${cmd}`], "input");
        setMsgHandle(cmd.trim());
        addLines([
          "",
          "  ENTER TRANSMISSION BODY:",
          "  (Type your message and press Enter)",
          "",
        ]);
        setMsgStep("body");
        return;
      }
      if (msgStep === "body") {
        addLines([`> ${cmd}`], "input");
        setMsgBody(cmd.trim());
        addLines([
          "",
          `  SENDER:  ${msgHandle}`,
          `  MESSAGE: ${cmd.trim()}`,
          "",
          "  TRANSMIT? (y/n)",
          "",
        ]);
        setMsgStep("confirm");
        return;
      }
      if (msgStep === "confirm") {
        addLines([`> ${cmd}`], "input");
        if (trimmed === "y" || trimmed === "yes") {
          addLines([
            "",
            "  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ TRANSMITTING...",
          ]);
          sendMessage(msgHandle, msgBody).then(() => {
            addLines([
              "  SUBSPACE RELAY LOCKED",
              "  ENCRYPTION: AES-512 QUANTUM",
              "  ROUTING: NODE 7 → NODE 3 → DEST",
              "  ✓ TRANSMISSION COMPLETE",
              "",
              "  Message queued for delivery.",
              "  Ben will receive your transmission shortly.",
              "",
            ]);
          });
        } else {
          addLines(["", "  TRANSMISSION ABORTED.", ""]);
        }
        setMsgStep("idle");
        setMsgHandle("");
        setMsgBody("");
        return;
      }

      addLines([`> ${cmd}`], "input");

      if (trimmed === "") return;

      if (trimmed === "help" || trimmed === "5") {
        addLines(
          [
            "",
            "  Available commands:",
            "",
            "    1) articles    - Published writings",
            "    2) events      - Upcoming appearances",
            "    3) talks       - Talks & workshops",
            "    4) contact     - Subspace relay",
            "    5) help        - Show this menu",
            "    6) theme <n>   - Change visual theme",
            "       read <n>    - Open article by number",
            "",
          ],
          "menu",
        );
      } else if (trimmed === "clear") {
        setLines([]);
      } else if (trimmed === "articles" || trimmed === "1") {
        navigate("/articles");
        addLines(["", "── ARTICLES ──────────────", ""]);
        ARTICLES.forEach((a, idx) => {
          const startId = nextIdRef.current;
          nextIdRef.current += 4;
          setLines((old) => [
            ...old,
            { id: startId, text: `  [${idx + 1}] ${formatDate(a.date)}`, type: "output" },
            {
              id: startId + 1,
              text: `  ${a.title}`,
              type: "link" as const,
              onClick: () => {
                navigate(`/articles/${a.slug}`);
                showArticle(a.slug);
              },
            },
            { id: startId + 2, text: `  ${a.summary}`, type: "output" },
            { id: startId + 3, text: "", type: "output" },
          ]);
        });
        addLines(["  Type 'read <number>' to open an article.", ""]);
      } else if (trimmed === "events" || trimmed === "2") {
        navigate("/events");
        const eventLines: (string | { text: string; href: string })[] = [
          "",
          "── EVENTS ────────────────",
          "",
        ];
        EVENTS.forEach((e) => {
          const roleTag = e.role === "workshop" ? "[WORKSHOP]" : e.role === "speaking" ? "[SPEAKING]" : "[ATTENDING]";
          eventLines.push(`  ${roleTag} ${e.name}`);
          eventLines.push(`  Date: ${formatDate(e.date)}  |  Location: ${e.location}`);
          if (e.talk) eventLines.push(`  Talk: ${e.talk}`);
          eventLines.push("");
        });
        addLines(eventLines);
      } else if (trimmed === "talks" || trimmed === "3") {
        navigate("/talks");
        const talkLines: (string | { text: string; href: string })[] = [
          "",
          "── TALKS & WORKSHOPS ─────",
          "",
        ];
        TALKS.forEach((t) => {
          const tag = t.type === "workshop" ? "[WORKSHOP]" : "[TALK]";
          talkLines.push(`  ${tag} ${t.title}`);
          talkLines.push(`  ${t.event} — ${formatDate(t.date)}`);
          talkLines.push(`  ${t.description}`);
          talkLines.push("");
        });
        addLines(talkLines);
      } else if (trimmed === "contact" || trimmed === "4") {
        navigate("/contact");
        addLines([
          "",
          "── SUBSPACE RELAY ────────",
          "",
          "  COMMUNICATION CHANNELS:",
          "",
        ]);
        addLines([
          { text: "  [GIT]  github.com/bendechrai", href: SOCIAL_LINKS.github },
          { text: "  [NET]  linkedin.com/in/bendechrai", href: SOCIAL_LINKS.linkedin },
          { text: "  [SIG]  twitter.com/bendechrai", href: SOCIAL_LINKS.twitter },
        ]);
        addLines([
          "",
          "  ── SEND TRANSMISSION ──",
          "",
          "  ENTER YOUR HANDLE / CALLSIGN:",
          "",
        ]);
        setMsgStep("handle");
      } else if (trimmed.startsWith("read ")) {
        const arg = trimmed.slice(5).trim();
        const num = parseInt(arg, 10);
        let slug: string | undefined;
        if (!isNaN(num) && num >= 1 && num <= ARTICLES.length) {
          slug = ARTICLES[num - 1].slug;
        } else {
          slug = ARTICLES.find((a) => a.slug === arg)?.slug;
        }
        if (slug) {
          navigate(`/articles/${slug}`);
          showArticle(slug);
        } else {
          addLines(["", `  Article not found: ${arg}`, "  Usage: read <number> or read <slug>", ""]);
        }
      } else if (trimmed.startsWith("theme ") || trimmed === "6") {
        const themeName = trimmed === "6" ? "" : trimmed.slice(6).trim();
        const validThemes = ["starship", "cyberpunk", "terminal", "holographic", "retro", "fms"];
        if (validThemes.includes(themeName)) {
          addLines([``, `  Switching to ${themeName} theme...`, ``]);
          setTimeout(() => setTheme(themeName as Parameters<typeof setTheme>[0]), 500);
        } else {
          addLines([
            "",
            "  Available themes: starship, cyberpunk, terminal, holographic, retro, fms",
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
    [addLines, setTheme, msgStep, msgHandle, msgBody, navigate, showArticle],
  );

  // Auto-display content based on URL section on mount
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (articleSlug) {
        const article = getArticleBySlug(articleSlug);
        if (article) {
          const articleLines: (string | { text: string; href: string })[] = [
            "",
            "── ARTICLE ───────────────",
            "",
            `  ${article.title}`,
            `  ${formatDate(article.date)}`,
            "",
            `  ${article.summary}`,
            "",
          ];
          // Add body paragraphs
          if (article.body) {
            articleLines.push("  ──────────────────────────");
            articleLines.push("");
            for (const para of article.body.split("\n\n")) {
              articleLines.push(`  ${para}`);
              articleLines.push("");
            }
          }
          // Add image as a special line
          const startId = nextIdRef.current;
          nextIdRef.current += 1;
          setLines((old) => [
            ...old,
            { id: startId, text: "", type: "image" as const, imageSrc: article.image },
          ]);
          addLines(articleLines);
        }
      } else if (section !== "home") {
        const sectionCommands: Record<string, string> = {
          articles: "articles",
          events: "events",
          talks: "talks",
          contact: "contact",
        };
        const cmd = sectionCommands[section];
        if (cmd) {
          handleCommand(cmd);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  const handleScreenClick = () => {
    inputRef.current?.focus();
  };

  const promptLabel = msgStep === "handle"
    ? "HANDLE> "
    : msgStep === "body"
      ? "MSG> "
      : msgStep === "confirm"
        ? "Y/N> "
        : "> ";

  return (
    <div className={styles.crt} onClick={handleScreenClick}>
      <div className={styles.scanline} />
      <div className={styles.screen}>
        <div className={styles.output} ref={scrollRef}>
          {lines.map((line) => (
            <div
              key={line.id}
              className={`${styles.line} ${
                line.type === "header"
                  ? styles.bright
                  : line.type === "separator"
                    ? styles.dim
                    : line.type === "input"
                      ? styles.inputLine
                      : line.type === "menu"
                        ? styles.menu
                        : line.type === "link"
                          ? styles.linkLine
                          : ""
              }`}
            >
              {line.type === "image" && line.imageSrc ? (
                <img src={line.imageSrc} alt="" className={styles.articleImage} />
              ) : line.href ? (
                <a href={line.href} target="_blank" rel="noopener noreferrer" className={styles.termLink}>
                  {line.text}
                </a>
              ) : line.onClick ? (
                <span className={styles.termLink} onClick={line.onClick} style={{ cursor: "pointer" }}>
                  {line.text}
                </span>
              ) : (
                line.text || "\u00A0"
              )}
            </div>
          ))}
        </div>
        <div className={styles.prompt}>
          <span className={styles.promptChar}>{promptLabel}</span>
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
