/* chat-backend.js
 *
 * Chat is Groq-only. The API key comes from VITE_GROQ_API_KEY at build time
 * (injected via the GROQ_API_KEY GitHub Actions secret) or from localStorage
 * for local overrides. If no key is configured, ask() throws.
 */

import C from "../content.jsx";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const LS_KEY = "portfolio.groq.apiKey";

function getGroqKey() {
  if (typeof window === "undefined") return "";
  const ls = window.localStorage.getItem(LS_KEY) || "";
  const env =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_GROQ_API_KEY) ||
    "";
  return (ls || env || "").trim();
}

async function askGroq(messages, apiKey) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 700,
      messages,
    }),
  });

  if (!res.ok) {
    let msg = `Groq error ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.error?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

async function streamGroq(messages, apiKey, onChunk) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 700,
      stream: true,
      messages,
    }),
  });

  if (!res.ok) {
    let msg = `Groq error ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.error?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return full;
      try {
        const json = JSON.parse(payload);
        const delta = json?.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onChunk(delta, full);
        }
      } catch (_) {}
    }
  }
  return full;
}

export function installChatBackend() {
  if (typeof window === "undefined") return;
  if (window.portfolio && typeof window.portfolio.ask === "function") return;
  window.portfolio = window.portfolio || {};

  window.portfolio.setGroqKey = function setGroqKey(key) {
    const clean = String(key || "").trim();
    if (!clean) return false;
    window.localStorage.setItem(LS_KEY, clean);
    return true;
  };

  window.portfolio.clearGroqKey = function clearGroqKey() {
    window.localStorage.removeItem(LS_KEY);
  };

  window.portfolio.chatMode = function chatMode() {
    return getGroqKey() ? "groq" : "no-key";
  };

  window.portfolio.ask = async function ask({ messages }) {
    const apiKey = getGroqKey();
    if (!apiKey) {
      throw new Error(
        "Chat is unavailable: no Groq API key configured. Set window.portfolio.setGroqKey('gsk_...') to use it locally.",
      );
    }
    return await askGroq(messages, apiKey);
  };

  window.portfolio.askStream = async function askStream({ messages, onChunk }) {
    const apiKey = getGroqKey();
    if (!apiKey) {
      throw new Error(
        "Chat is unavailable: no Groq API key configured. Set window.portfolio.setGroqKey('gsk_...') to use it locally.",
      );
    }
    return await streamGroq(messages, apiKey, onChunk || (() => {}));
  };
}

// Re-export the bilingual content so the system-prompt builder has the same
// shape it had against window.PORTFOLIO in the original code.
export function getPortfolio(lang) {
  return C[lang] || C.en;
}
