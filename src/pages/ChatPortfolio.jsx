/* ChatPortfolio.jsx — conversational portfolio shell.
 * Chat goes through window.portfolio.ask({ messages }), which is a small
 * provider-agnostic hook. Locally it's stubbed by src/lib/chat-backend.js;
 * in production we'll point it at our own proxy. */

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import C from "../content.jsx";
import { useTweaks } from "../lib/tweaks.jsx";
import { Halo, PixelPortrait } from "../components/Halo.jsx";
import chatCss from "../styles/chat.css?inline";

const TWEAK_DEFAULTS = { lang: "en", dark: false };

function buildSystemPrompt(lang) {
  const c = C[lang] || C.en;

  const expSummary = c.experiences.map((x) =>
    `- ${x.role} at ${x.co} (${x.coNote}), ${x.when} · ${x.where}. Focus: ${x.focus}. Stack: ${x.stack.join(", ")}.`
  ).join("\n");

  const projSummary = c.projects.map((p) =>
    `- ${plainTitle(p.title)} (${p.kind}${p.award ? ", " + p.award : ""}${p.link ? ", " + p.link : ""}). Tags: ${(p.tags || []).join(", ")}.`
  ).join("\n");

  const skillSummary = c.skills.map((g) => `${g.g}: ${g.items.join(", ")}`).join("\n");
  const awardSummary = c.awards.map((a) => `${a.rank} ${plainTitle(a.label)} (${a.when})`).join("\n");

  return [
    `You ARE Jalaleddin El Firqi, a final-year engineering student at ENSAM Meknès specialising in AI/Data Science AND DevOps (Kubernetes, GitLab CI). Reply in the FIRST PERSON ("I built…", "I'm currently…"). Be warm, concise, and concrete — like a senior peer in casual conversation. Never say you are an AI.`,
    `Tone: confident but not boastful, slightly editorial, occasionally dry-witted. Keep most replies to 2–4 short paragraphs OR a tight bulleted list. Use plain text (no markdown headings). Use **bold** sparingly, for the names of technologies or projects.`,
    `Currently: open to first full-time roles starting August 2026, in AI/ML or DevOps/Platform engineering.`,
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
    Object.values(c.contact.rows).map((r) => `${r.k}: ${r.v}`).join("\n"),
    ``,
    `Rules:`,
    `- If asked about something not in my background, say so honestly.`,
    `- Always reply in ${lang === "fr" ? "French" : "English"}.`,
    `- For DevOps questions, foreground QtoDash (5-VM cluster: 1 GitLab, 1 NGINX proxy, 3 K8s nodes) and Sawti (Kubernetes-deployed crowdsourcing platform).`,
    `- For AI questions, foreground SIANA (RUL prediction on 12 TGV trainsets), AI-Inside (YOLOv8 defect detection, -50% data prep time), and the Innov'AM-winning inspection robot.`,
    `- When relevant, mention the specific technology by exact name (Kubernetes, GitLab, Docker, NGINX, PyTorch, YOLOv8, etc.) so the orbital icons can highlight.`,
  ].join("\n");
}

function plainTitle(node) {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainTitle).join("");
  if (node.props && node.props.children != null) return plainTitle(node.props.children);
  return "";
}

const HIGHLIGHT_KEYWORDS = {
  kubernetes:   ["kubernetes","k8s","kubectl","helm","cluster","ingress","hpa"],
  gitlab:       ["gitlab","ci/cd","pipeline","runner"],
  docker:       ["docker","container","compose","dockerfile"],
  nginx:        ["nginx","reverse proxy","proxy","tls"],
  terraform:    ["terraform","iac","infrastructure as code"],
  prometheus:   ["prometheus","metrics","alert"],
  grafana:      ["grafana","dashboard","observability"],
  linux:        ["linux","ubuntu","debian","systemd"],
  python:       ["python","pandas","numpy","sklearn"],
  pytorch:      ["pytorch","torch","neural","deep learning"],
  react:        ["react","frontend","jsx","tsx"],
  django:       ["django","drf","rest framework"],
  postgresql:   ["postgres","postgresql","sql","database"],
  apachekafka:  ["kafka","stream"],
  apachespark:  ["spark","streaming","pyspark"],
  nvidia:       ["nvidia","triton","cuda","gpu"],
  opencv:       ["opencv","cv2","image processing"],
  raspberrypi:  ["raspberry","pi","edge"],
  minio:        ["minio","s3","object store"],
  huggingface:  ["hugging face","huggingface","transformer","hf"],
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
    "What's your strongest project?",
    "Tell me about QtoDash.",
    "Show me your DevOps work.",
    "Are you available for hire?",
    "Why AI + DevOps?",
    "What did you build at SIANA?",
  ],
  fr: [
    "Quel est votre meilleur projet ?",
    "Parle-moi de QtoDash.",
    "Tes projets DevOps ?",
    "Es-tu disponible pour un poste ?",
    "Pourquoi IA + DevOps ?",
    "Qu'as-tu fait chez SIANA ?",
  ],
};

const HEADING = {
  en: { eyebrow: "Live · Talk to my portfolio", h1: <>Ask me <em>anything.</em></>, sub: "This page is me, in conversation. Hit a chip below or type a question — I'll answer in real time. The orbiting icons highlight when I mention a tool I use.", placeholder: "Ask about projects, infra, AI, availability…", voiceLabel: "Voice mode", voiceHint: "Hold the mic to speak; I'll read replies aloud.", voiceUnavailable: "Voice not supported by this browser — try Chrome / Edge." },
  fr: { eyebrow: "En direct · Parlez à mon portfolio", h1: <>Demandez-moi <em>n'importe quoi.</em></>, sub: "Cette page, c'est moi en conversation. Choisissez une suggestion ou tapez une question — je réponds en direct. Les icônes en orbite s'illuminent quand je mentionne un outil.", placeholder: "Projets, infra, IA, disponibilité…", voiceLabel: "Mode vocal", voiceHint: "Cliquez le micro pour parler ; je lirai mes réponses à voix haute.", voiceUnavailable: "Voix non supportée par ce navigateur — essayez Chrome / Edge." },
};

const FALLBACK = {
  en: { h: <>Prefer the <em>full editorial</em> portfolio?</>, p: "If chat isn't your thing, the long-form version has every project, role, award and skill laid out the traditional way.", cta: "Open the editorial portfolio →" },
  fr: { h: <>Vous préférez la version <em>éditoriale</em> ?</>, p: "Si le chat n'est pas votre truc, la version classique détaille tous les projets, postes, distinctions et compétences.", cta: "Ouvrir le portfolio éditorial →" },
};

function SunIcon()   { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>); }
function MoonIcon()  { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>); }
function MicIcon()   { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>); }
function SpeakIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/></svg>); }
function StopIcon()  { return (<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>); }

const SpeechRec = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
function speechAvailable() { return !!SpeechRec && typeof window !== "undefined" && "speechSynthesis" in window; }

function speak(text, lang, onEnd) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd && onEnd();
    return null;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "fr" ? "fr-FR" : "en-US";
  utter.rate = 1.02;
  utter.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const wantLang = utter.lang.toLowerCase().slice(0, 2);
  const candidates = voices.filter((v) => v.lang.toLowerCase().startsWith(wantLang));
  const male = candidates.find((v) => /male|daniel|alex|fred|thomas|nicolas|guy/i.test(v.name));
  utter.voice = male || candidates[0] || null;
  utter.onend = () => onEnd && onEnd();
  utter.onerror = () => onEnd && onEnd();
  window.speechSynthesis.speak(utter);
  return utter;
}

export default function ChatPortfolio() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(-1);
  const [groqKeyInput, setGroqKeyInput] = useState("");
  const [chatMode, setChatMode] = useState("local-stub");
  const logRef = useRef(null);
  const recogRef = useRef(null);

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

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.portfolio?.chatMode) {
      setChatMode(window.portfolio.chatMode());
    }
  }, []);

  function startListening() {
    if (!SpeechRec) return;
    if (recogRef.current) { try { recogRef.current.stop(); } catch (_) {} }
    const r = new SpeechRec();
    r.lang = t.lang === "fr" ? "fr-FR" : "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.continuous = false;
    r.onresult = (ev) => {
      const heard = ev.results[0][0].transcript;
      setListening(false);
      if (heard && heard.trim()) send(heard.trim());
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recogRef.current = r;
    setListening(true);
    try { r.start(); } catch (_) { setListening(false); }
  }
  function stopListening() {
    if (recogRef.current) { try { recogRef.current.stop(); } catch (_) {} }
    setListening(false);
  }

  function speakMessage(idx, text) {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(-1);
      return;
    }
    setSpeakingIdx(idx);
    speak(text, t.lang, () => setSpeakingIdx(-1));
  }

  const head = HEADING[t.lang] || HEADING.en;
  const fb = FALLBACK[t.lang] || FALLBACK.en;
  const chips = SUGGESTED[t.lang] || SUGGESTED.en;

  function saveGroqKey() {
    const key = groqKeyInput.trim();
    if (!key || !window.portfolio?.setGroqKey) return;
    window.portfolio.setGroqKey(key);
    setGroqKeyInput("");
    setChatMode(window.portfolio.chatMode());
  }

  function clearGroqKey() {
    if (!window.portfolio?.clearGroqKey) return;
    window.portfolio.clearGroqKey();
    setChatMode(window.portfolio.chatMode());
  }

  async function send(prompt) {
    const text = (prompt ?? input).trim();
    if (!text || thinking) return;
    setInput("");
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
      const reply = await window.portfolio.ask({
        messages: [
          { role: "system", content: sys },
          ...history,
        ],
      });
      const replyText = (reply || "").trim();
      setMessages((m) => [...m, { role: "assistant", text: replyText }]);
      setHighlight((prev) => Array.from(new Set([...prev, ...detectHighlights(replyText)])));
      if (voiceMode && replyText) {
        const newIdx = next.length;
        setTimeout(() => {
          setSpeakingIdx(newIdx);
          speak(replyText, t.lang, () => setSpeakingIdx(-1));
        }, 120);
      }
    } catch (e) {
      setMessages((m) => [...m, {
        role: "assistant",
        text: t.lang === "fr"
          ? "Désolé, j'ai eu un souci pour répondre. Réessayez ?"
          : "Sorry — I hit a snag answering that. Try again?",
      }]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      <style>{chatCss}</style>
      <header className="topbar" data-screen-label="00 Chat hero">
        <div className="brand"><b>J·EF</b> / Chat Portfolio · 26</div>
        <div className="topbar-right">
          <Link to="/editorial" className="brand"
                style={{ textDecoration: "underline", textDecorationColor: "var(--rule)", textUnderlineOffset: 4 }}>
            {t.lang === "fr" ? "Version éditoriale" : "Editorial version"}
          </Link>
          <div className="seg" role="tablist" aria-label="Language">
            <button aria-pressed={t.lang === "en"} onClick={() => setTweak("lang", "en")}>EN</button>
            <button aria-pressed={t.lang === "fr"} onClick={() => setTweak("lang", "fr")}>FR</button>
          </div>
          <button className="icon-btn" onClick={() => setTweak("dark", !t.dark)} aria-label="Toggle theme">
            {t.dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <div className="status-strip">
        <span><b>STATUS</b> Available · Aug 2026</span>
        <span><b>ROLE</b> AI · DevOps engineer</span>
        <span><b>BASED IN</b> Meknès · MA</span>
        <span><b>BUILT</b> 2026 · v1</span>
      </div>

      <main className="stage">
        <div className="halo-col">
          <Halo thinking={thinking} highlight={highlight} />
          <div className="portrait" data-thinking={thinking ? "true" : "false"}>
            <div className="pulse"></div>
            <PixelPortrait />
          </div>
        </div>

        <section className="chat-col">
          <div className="chat-eyebrow">
            <span className="live-dot"></span>{head.eyebrow}
          </div>
          <h1 className="chat-h1">{head.h1}</h1>
          <p className="chat-sub">{head.sub}</p>

          <div className="chat-shell">
            <div className="chat-log" ref={logRef}>
              {messages.length === 0 && (
                <div className="msg bot">
                  <div className="who">JF</div>
                  <div className="body">
                    {t.lang === "fr"
                      ? <>Salut 👋 — je suis Jalaleddin. Pose-moi une question sur mes projets, mon stack, ou ce que je cherche pour 2026.</>
                      : <>Hey 👋 — I'm Jalaleddin. Ask me anything about my projects, my stack, or what I'm looking for in 2026.</>}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={"msg " + (m.role === "user" ? "you" : "bot")}>
                  <div className="who">{m.role === "user" ? (t.lang === "fr" ? "VS" : "YOU") : "JF"}</div>
                  <div className="body">
                    {m.text.split(/\n\n+/).map((para, j) => (
                      <p key={j} dangerouslySetInnerHTML={{
                        __html: para
                          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br/>"),
                      }} />
                    ))}
                    {m.role === "assistant" && typeof window !== "undefined" && "speechSynthesis" in window && (
                      <button
                        className={"speak-btn" + (speakingIdx === i ? " playing" : "")}
                        onClick={() => speakMessage(i, m.text)}
                        aria-label={speakingIdx === i ? "Stop" : "Read aloud"}
                        title={speakingIdx === i ? "Stop" : "Read aloud"}
                      >
                        {speakingIdx === i ? <StopIcon /> : <SpeakIcon />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="msg bot">
                  <div className="who">JF</div>
                  <div className="body"><span className="typing"><span></span><span></span><span></span></span></div>
                </div>
              )}
            </div>

            {messages.length === 0 && (
              <div className="suggested">
                {chips.map((q) => (
                  <button key={q} className="chip" onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}

            <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
              {SpeechRec && (
                <button
                  type="button"
                  className="mic-btn"
                  data-listening={listening ? "true" : "false"}
                  onClick={listening ? stopListening : startListening}
                  aria-label={listening ? "Stop listening" : "Start voice input"}
                  title={listening ? (t.lang === "fr" ? "Arrêter" : "Stop") : (t.lang === "fr" ? "Parler" : "Speak")}
                ><MicIcon /></button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? (t.lang === "fr" ? "Écoute…" : "Listening…") : head.placeholder}
                aria-label="Message"
                disabled={listening}
              />
              <button className="send-btn" type="submit" disabled={!input.trim() || thinking}>
                {t.lang === "fr" ? "Envoyer" : "Send"} →
              </button>
            </form>

            <div className="voice-row">
              <label className="voice-toggle">
                <input
                  type="checkbox"
                  checked={voiceMode}
                  disabled={!speechAvailable()}
                  onChange={(e) => setVoiceMode(e.target.checked)}
                />
                <b>{head.voiceLabel}</b>
              </label>
              <span className="hint">
                {speechAvailable() ? head.voiceHint : head.voiceUnavailable}
              </span>
            </div>

            <div className="voice-row" style={{ marginTop: 8 }}>
              <span className="hint">
                {t.lang === "fr" ? "Mode chat" : "Chat mode"}: <b>{chatMode === "groq" ? "Groq live" : "Local stub"}</b>
              </span>
            </div>

            <div className="composer" style={{ marginTop: 8 }}>
              <input
                type="password"
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                placeholder={t.lang === "fr" ? "Coller clé Groq (stockée localement)" : "Paste Groq key (stored locally)"}
                aria-label="Groq API key"
              />
              <button className="send-btn" type="button" onClick={saveGroqKey} disabled={!groqKeyInput.trim()}>
                {t.lang === "fr" ? "Activer Groq" : "Enable Groq"}
              </button>
              <button className="send-btn" type="button" onClick={clearGroqKey}>
                {t.lang === "fr" ? "Retirer" : "Clear"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <section className="fallback">
        <h2>{fb.h}</h2>
        <p>{fb.p}</p>
        <Link className="cta" to="/editorial">{fb.cta}</Link>
      </section>
    </>
  );
}
