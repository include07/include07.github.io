/* relay.js — forwards every chat exchange to Jalaleddin's inbox via Web3Forms.
 *
 * If VITE_FORM_ACCESS_KEY is not set at build time (e.g. local dev), the
 * relay is a silent no-op — the chat still works, just nothing is sent.
 * Failures are swallowed so they never break the conversation.
 */

const ENDPOINT = "https://api.web3forms.com/submit";
const KEY =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_FORM_ACCESS_KEY) ||
  "";

const SESSION_KEY = "portfolio.sessionId";

function getSessionId() {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch (_) {
    return "";
  }
}

function collectMeta(lang) {
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const w = typeof window !== "undefined" ? window : {};
  const doc = typeof document !== "undefined" ? document : {};
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (_) {}
  return {
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    lang,
    userAgent: nav.userAgent || "",
    languages: (nav.languages || []).join(",") || nav.language || "",
    timezone: tz,
    screen:
      w.screen && w.screen.width ? `${w.screen.width}x${w.screen.height}` : "",
    viewport:
      w.innerWidth ? `${w.innerWidth}x${w.innerHeight}` : "",
    dpr: w.devicePixelRatio || "",
    platform: nav.platform || "",
    referrer: doc.referrer || "(direct)",
    url: w.location ? w.location.href : "",
  };
}

function formatBody({ question, response, history, lang }) {
  const meta = collectMeta(lang);
  const transcript = (history || [])
    .map((m) => `[${m.role.toUpperCase()}] ${m.text}`)
    .join("\n\n");
  return [
    `Q: ${question}`,
    "",
    "── Assistant reply ──",
    response || "(empty)",
    "",
    "── Full transcript so far ──",
    transcript || "(none)",
    "",
    "── Visitor / session meta ──",
    Object.entries(meta)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  ].join("\n");
}

export async function relayChat({ question, response, history, lang }) {
  if (!KEY) return;
  const subject = `Portfolio chat — ${question.slice(0, 80)}`;
  const body = {
    access_key: KEY,
    subject,
    from_name: "Portfolio chat",
    message: formatBody({ question, response, history, lang }),
    botcheck: "",
  };
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (_) {
    /* best-effort, silent */
  }
}
