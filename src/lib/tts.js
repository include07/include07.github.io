/* tts.js — text-to-speech playback in Jalaleddin's cloned voice.
 *
 * Flow:
 *   1. synthesize(text, lang) POSTs the text to chat-api.qtodash.tech, which
 *      injects the ElevenLabs API key and voice_id server-side and forwards
 *      to ElevenLabs. The browser receives an MP3 blob.
 *   2. play(url) plays it. Returns an Audio element so callers can stop it.
 *
 * Same proxy/localStorage-bypass conventions as chat-backend.js: a direct
 * key in localStorage skips the proxy (useful for local dev with a personal
 * ElevenLabs key).
 */

const DEFAULT_PROXY = "https://chat-api.qtodash.tech/v1/audio/speech";
const PROXY_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_CHAT_API_URL &&
    import.meta.env.VITE_CHAT_API_URL.replace(
      "/v1/chat/completions",
      "/v1/audio/speech",
    )) ||
  DEFAULT_PROXY;

// Pick model: multilingual v2 is the standard for cloned voices in EN/FR/etc.
// turbo_v2_5 is faster but loses a bit of clone fidelity.
const TTS_MODEL = "eleven_multilingual_v2";

/* Synthesize speech for `text` in the user's cloned voice.
 * Returns a Blob URL the caller can hand to a new Audio(). */
export async function synthesize(text, lang) {
  if (!text || !text.trim()) throw new Error("empty text");

  const body = {
    text,
    model_id: TTS_MODEL,
    // ElevenLabs auto-detects language from the text content; passing it
    // explicitly isn't required but doesn't hurt for hint biasing in EN/FR.
    language_code: lang === "fr" ? "fr" : "en",
    voice_settings: {
      stability: 0.45,
      similarity_boost: 0.85,
      style: 0.15,
      use_speaker_boost: true,
    },
  };

  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `TTS error ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.detail?.message || err?.error?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/* Wrap a Blob URL in an Audio element. Returns { play, stop, audio }. */
export function play(url, { onEnded, onError } = {}) {
  const audio = new Audio(url);
  if (onEnded) audio.addEventListener("ended", onEnded);
  if (onError) audio.addEventListener("error", onError);
  audio.play().catch((e) => {
    // Autoplay rejection or load failure
    if (onError) onError(e);
  });
  return {
    audio,
    stop: () => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}
      URL.revokeObjectURL(url);
    },
  };
}
