/* ChatPortfolio.jsx — conversational portfolio shell.
 * Chat goes through window.portfolio.ask({ messages }), which is a small
 * provider-agnostic hook. Locally it's stubbed by src/lib/chat-backend.js;
 * in production we'll point it at our own proxy. */

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import C from "../content.jsx";
import { useTweaks } from "../lib/tweaks.jsx";
import { Halo } from "../components/Halo.jsx";
import { PERSONA_NOTES } from "../lib/persona.js";
import chatCss from "../styles/chat.css?inline";

const TWEAK_DEFAULTS = { lang: "en", dark: false };

function buildSystemPrompt(lang) {
  const c = C[lang] || C.en;

  const expSummary = c.experiences
    .map(
      (x) =>
        `- ${x.role} at ${x.co} (${x.coNote}), ${x.when} · ${x.where}. Focus: ${x.focus}. Stack: ${x.stack.join(", ")}.`,
    )
    .join("\n");

  const projSummary = c.projects
    .map(
      (p) =>
        `- ${plainTitle(p.title)} (${p.kind}${p.award ? ", " + p.award : ""}${p.link ? ", " + p.link : ""}). Tags: ${(p.tags || []).join(", ")}.`,
    )
    .join("\n");

  const skillSummary = c.skills
    .map((g) => `${g.g}: ${g.items.join(", ")}`)
    .join("\n");
  const awardSummary = c.awards
    .map((a) => `${a.rank} ${plainTitle(a.label)} (${a.when})`)
    .join("\n");

  return [
    `You ARE Jalaleddin El Firqi, a final-year engineering student at ENSAM Meknès. Your positioning is AI & full-stack engineer who delivers industrial software end-to-end — from needs analysis through ML/data science to React/Django web apps and deployment. Reply in the FIRST PERSON ("I built…", "I'm currently…"). Be warm, concise, and concrete — like a senior peer in casual conversation. Never say you are an AI.`,
    `Tone: confident but not boastful, slightly editorial, occasionally dry-witted. Keep most replies to 2–4 short paragraphs OR a tight bulleted list. Use plain text (no markdown headings). Use **bold** sparingly, for the names of technologies or projects.`,
    `Currently: open to first full-time roles starting August 2026, in AI/ML and full-stack engineering for industry.`,
    ``,
    `=== EXPERIENCE ===`,
    expSummary,
    ``,
    `=== PROJECTS ===`,
    projSummary,
    ``,
    `=== SKILLS ===`,
    skillSummary,
    ``,
    `=== AWARDS ===`,
    awardSummary,
    ``,
    `=== CONTACT ===`,
    Object.values(c.contact.rows)
      .map((r) => `${r.k}: ${r.v}`)
      .join("\n"),
    ``,
    `=== EXTENDED NOTES (defensive framings, narrative beats) ===`,
    PERSONA_NOTES[lang] || PERSONA_NOTES.en,
    ``,
    `Rules:`,
    `- Use only facts present in the CV context and notes above. Do not invent companies, dates, metrics, or technologies.`,
    `- If asked about something not in my background, say so honestly.`,
    `- Always reply in ${lang === "fr" ? "French" : "English"}.`,
    `- For full-stack / web questions, foreground SI-ESSIEUX (React + Django + SQL Server at SIANA) and QC Management System (React + Flask + PostgreSQL + MinIO at AI-Inside).`,
    `- For ML/AI questions, foreground SIANA's RUL pipeline (survival analysis + gradient boosting), AI-Inside's YOLOv8 defect detection in production, and the Innov'AM-winning inspection robot.`,
    `- For infrastructure questions, foreground QtoDash (target architecture: 5-VM cluster — 1 GitLab, 1 NGINX, 3 K8s nodes; currently shipping a text-mode build at app.qtodash.tech).`,
    `- When relevant, mention the specific technology by exact name (Kubernetes, GitLab, Docker, NGINX, scikit-learn, XGBoost, PyTorch, YOLOv8, etc.) so the orbital icons can highlight.`,
  ].join("\n");
}

function ShellPrompt() {
  return (
    <span className="shell-prompt" aria-hidden="true">
      <span className="u">you</span>
      <span className="at">@</span>
      <span className="h">portfolio</span>
      <span className="colon">:</span>
      <span className="p">~</span>
      <span className="dollar">$</span>
    </span>
  );
}

function plainTitle(node) {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainTitle).join("");
  if (node.props && node.props.children != null)
    return plainTitle(node.props.children);
  return "";
}

const HIGHLIGHT_KEYWORDS = {
  kubernetes: [
    "kubernetes",
    "k8s",
    "kubectl",
    "helm",
    "cluster",
    "ingress",
    "hpa",
  ],
  gitlab: ["gitlab", "ci/cd", "pipeline", "runner"],
  docker: ["docker", "container", "compose", "dockerfile"],
  nginx: ["nginx", "reverse proxy", "proxy", "tls"],
  terraform: ["terraform", "iac", "infrastructure as code"],
  prometheus: ["prometheus", "metrics", "alert"],
  grafana: ["grafana", "dashboard", "observability"],
  linux: ["linux", "ubuntu", "debian", "systemd"],
  python: ["python", "pandas", "numpy", "sklearn"],
  pytorch: ["pytorch", "torch", "neural", "deep learning"],
  react: ["react", "frontend", "jsx", "tsx"],
  django: ["django", "drf", "rest framework"],
  postgresql: ["postgres", "postgresql", "sql", "database"],
  apachekafka: ["kafka", "stream"],
  apachespark: ["spark", "streaming", "pyspark"],
  nvidia: ["nvidia", "triton", "cuda", "gpu"],
  opencv: ["opencv", "cv2", "image processing"],
  raspberrypi: ["raspberry", "pi", "edge"],
  minio: ["minio", "s3", "object store"],
  huggingface: ["hugging face", "huggingface", "transformer", "hf"],
};

function detectHighlights(text) {
  const lo = (text || "").toLowerCase();
  const hits = [];
  for (const slug in HIGHLIGHT_KEYWORDS) {
    if (HIGHLIGHT_KEYWORDS[slug].some((k) => lo.includes(k))) hits.push(slug);
  }
  return hits;
}

const SUGGESTED = {
  en: [
    "What did you build at SIANA?",
    "Tell me about QtoDash.",
    "Walk me through your stack.",
    "Are you available for hire?",
  ],
  fr: [
    "Qu'as-tu fait chez SIANA ?",
    "Parle-moi de QtoDash.",
    "Présente-moi ton stack.",
    "Es-tu disponible pour un poste ?",
  ],
};

const HEADING = {
  en: {
    eyebrow: "Live · Talk to my portfolio",
    h1: (
      <>
        Ask me <em>anything.</em>
      </>
    ),
    sub: "This page is me, in conversation. Hit a chip below or type a question — I'll answer in real time. The orbiting icons highlight when I mention a tool I use.",
    placeholder: "Ask about projects, infra, AI, availability…",
  },
  fr: {
    eyebrow: "En direct · Parlez à mon portfolio",
    h1: (
      <>
        Demandez-moi <em>n'importe quoi.</em>
      </>
    ),
    sub: "Cette page, c'est moi en conversation. Choisissez une suggestion ou tapez une question — je réponds en direct. Les icônes en orbite s'illuminent quand je mentionne un outil.",
    placeholder: "Projets, infra, IA, disponibilité…",
  },
};

const FALLBACK = {
  en: {
    h: (
      <>
        Prefer the <em>full editorial</em> portfolio?
      </>
    ),
    p: "If chat isn't your thing, the long-form version has every project, role, award and skill laid out the traditional way.",
    cta: "Open the editorial portfolio →",
  },
  fr: {
    h: (
      <>
        Vous préférez la version <em>éditoriale</em> ?
      </>
    ),
    p: "Si le chat n'est pas votre truc, la version classique détaille tous les projets, postes, distinctions et compétences.",
    cta: "Ouvrir le portfolio éditorial →",
  },
};

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export default function ChatPortfolio() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.dark = t.dark ? "true" : "false";
    html.dataset.lang = t.lang;
    document.title = "Jalaleddin El Firqi · Chat Portfolio";
    return () => {
      delete html.dataset.dark;
    };
  }, [t.dark, t.lang]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, thinking]);

  const head = HEADING[t.lang] || HEADING.en;
  const fb = FALLBACK[t.lang] || FALLBACK.en;
  const chips = SUGGESTED[t.lang] || SUGGESTED.en;

  async function send(prompt) {
    const text = (prompt ?? input).trim();
    if (!text || thinking) return;
    setInput("");

    // Built-in shell commands (handled locally, never sent to the model).
    if (/^(clear|cls)$/i.test(text)) {
      setMessages([]);
      setHighlight([]);
      return;
    }

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setThinking(true);
    setHighlight(detectHighlights(text));

    try {
      const sys = buildSystemPrompt(t.lang);
      const history = next.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      let placeholderAdded = false;
      const reply = await window.portfolio.askStream({
        messages: [{ role: "system", content: sys }, ...history],
        onChunk: (_delta, full) => {
          if (!placeholderAdded) {
            placeholderAdded = true;
            setThinking(false);
            setMessages((m) => [...m, { role: "assistant", text: full, streaming: true }]);
          } else {
            setMessages((m) => {
              const copy = m.slice();
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = { ...last, text: full };
              }
              return copy;
            });
          }
        },
      });
      const replyText = (reply || "").trim();
      setMessages((m) => {
        const copy = m.slice();
        const last = copy[copy.length - 1];
        if (last && last.role === "assistant") {
          copy[copy.length - 1] = { role: "assistant", text: replyText };
        } else {
          copy.push({ role: "assistant", text: replyText });
        }
        return copy;
      });
      setHighlight((prev) =>
        Array.from(new Set([...prev, ...detectHighlights(replyText)])),
      );
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            t.lang === "fr"
              ? "Désolé, j'ai eu un souci pour répondre. Réessayez ?"
              : "Sorry — I hit a snag answering that. Try again?",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      <style>{chatCss}</style>
      <header className="topbar" data-screen-label="00 Chat hero">
        <div className="brand">
          <b>J·EF</b> / Chat Portfolio · 26
        </div>
        <div className="topbar-right">
          <Link to="/editorial" className="editorial-btn">
            {t.lang === "fr" ? "Version éditoriale" : "Editorial version"}
            <span className="arr">↗</span>
          </Link>
          <div className="seg" role="tablist" aria-label="Language">
            <button
              aria-pressed={t.lang === "en"}
              onClick={() => setTweak("lang", "en")}
            >
              EN
            </button>
            <button
              aria-pressed={t.lang === "fr"}
              onClick={() => setTweak("lang", "fr")}
            >
              FR
            </button>
          </div>
          <button
            className="icon-btn"
            onClick={() => setTweak("dark", !t.dark)}
            aria-label="Toggle theme"
          >
            {t.dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <div className="status-strip">
        <span>
          <b>STATUS</b> Available · Aug 2026
        </span>
        <span>
          <b>ROLE</b> AI · Full-Stack engineer
        </span>
        <span>
          <b>BASED IN</b> Tangier · MA
        </span>
        <span>
          <b>BUILT</b> 2026 · v1
        </span>
      </div>

      <main className="stage">
        <div className="halo-col">
          <Halo thinking={thinking} highlight={highlight} />
          <div className="portrait" data-thinking={thinking ? "true" : "false"}>
            <div className="pulse"></div>
            <img className="portrait-img" src="/pixelised.png" alt="Jalaleddin pixel portrait" />
          </div>
        </div>

        <section className="chat-col">
          <div className="chat-eyebrow">
            <span className="live-dot"></span>
            {head.eyebrow}
          </div>
          <h1 className="chat-h1">{head.h1}</h1>

          <div className="chat-shell">
            {(messages.length > 0 || thinking) && (
            <div className="chat-log" ref={logRef}>
              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const isStreaming = m.role === "assistant" && isLast && m.streaming;
                return (
                  <div
                    key={i}
                    className={"msg " + (m.role === "user" ? "you" : "bot")}
                  >
                    {m.role === "user" && <ShellPrompt />}
                    <div className="body">
                      {m.text.split(/\n\n+/).map((para, j, arr) => (
                        <p
                          key={j}
                          dangerouslySetInnerHTML={{
                            __html:
                              para
                                .replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                                .replace(/\n/g, "<br/>") +
                              (isStreaming && j === arr.length - 1
                                ? '<span class="caret"></span>'
                                : ""),
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {thinking && (
                <div className="msg bot">
                  <div className="body">
                    <span className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            )}

            {messages.length === 0 && (
              <div className="suggested">
                {chips.map((q) => (
                  <button key={q} className="chip" onClick={() => send(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <ShellPrompt />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
                    e.preventDefault();
                    setMessages([]);
                    setHighlight([]);
                    setInput("");
                  }
                }}
                placeholder={head.placeholder}
                aria-label="Message"
              />
              <button
                className="send-btn"
                type="submit"
                disabled={!input.trim() || thinking}
              >
                {t.lang === "fr" ? "Envoyer" : "Send"} →
              </button>
            </form>

          </div>
        </section>
      </main>

      <section className="fallback">
        <h2>{fb.h}</h2>
        <p>{fb.p}</p>
        <Link className="cta" to="/editorial">
          {fb.cta}
        </Link>
      </section>
    </>
  );
}
