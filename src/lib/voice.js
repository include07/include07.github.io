/* voice.js — microphone capture + Groq Whisper transcription.
 *
 * Architecture:
 *   1. startRecording() asks for mic, starts MediaRecorder, returns a handle
 *      { stop, cancel, onLevel(cb), onSilence(cb) }.
 *   2. The caller (UI) decides when to stop — either via manual button click,
 *      or by listening to onSilence which fires after `silenceMs` of low RMS.
 *   3. transcribe(blob, lang) POSTs the audio as multipart/form-data to the
 *      chat-api proxy, which forwards to Groq Whisper. Returns the text.
 *
 * The same proxy URL / localStorage-bypass conventions as chat-backend.js are
 * honoured: VITE_CHAT_API_URL overrides the proxy; a personal Groq key in
 * localStorage skips the proxy entirely.
 */

const DEFAULT_PROXY = "https://chat-api.qtodash.tech/v1/audio/transcriptions";
const PROXY_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_CHAT_API_URL &&
    import.meta.env.VITE_CHAT_API_URL.replace(
      "/v1/chat/completions",
      "/v1/audio/transcriptions",
    )) ||
  DEFAULT_PROXY;
const GROQ_DIRECT_URL =
  "https://api.groq.com/openai/v1/audio/transcriptions";
const LS_KEY = "portfolio.groq.apiKey";
const WHISPER_MODEL = "whisper-large-v3-turbo";

function getLocalGroqKey() {
  if (typeof window === "undefined") return "";
  return (window.localStorage.getItem(LS_KEY) || "").trim();
}

function endpoint() {
  const local = getLocalGroqKey();
  if (local) {
    return { url: GROQ_DIRECT_URL, headers: { Authorization: `Bearer ${local}` } };
  }
  return { url: PROXY_URL, headers: {} };
}

export function isSupported() {
  if (typeof window === "undefined") return false;
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

/* Pick a mime type the browser actually supports. Safari only does mp4. */
function pickMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const m of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) {
      return m;
    }
  }
  return "audio/webm";
}

/* Start recording. Returns a controller:
 *   .stop()    → resolves to { blob, mimeType, durationMs }
 *   .cancel()  → discards, resolves to null
 *   .onLevel(fn) → fn(rms 0..1) ~30fps for UI animation
 *   .onSilence(fn, silenceMs=1500) → fn() fires after silenceMs of quiet
 */
export async function startRecording() {
  if (!isSupported()) {
    throw new Error("Microphone not supported in this browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks = [];
  const startedAt = Date.now();
  let levelCb = null;
  let silenceCb = null;
  let silenceMs = 1500;
  let stopResolver = null;
  let cancelled = false;
  let rafId = null;
  let silenceTimer = null;

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };
  recorder.onstop = () => {
    if (rafId) cancelAnimationFrame(rafId);
    if (silenceTimer) clearTimeout(silenceTimer);
    stream.getTracks().forEach((t) => t.stop());
    if (cancelled) {
      stopResolver && stopResolver(null);
      return;
    }
    const blob = new Blob(chunks, { type: mimeType });
    stopResolver && stopResolver({ blob, mimeType, durationMs: Date.now() - startedAt });
  };

  recorder.start();

  // Audio analyser for RMS level + silence detection.
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const buf = new Uint8Array(analyser.fftSize);

  // Wait a beat after start before silence-detection kicks in — otherwise
  // pre-speech silence will auto-stop instantly.
  const silenceArmedAt = Date.now() + 700;
  let lastVoiceAt = Date.now();

  function tick() {
    analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / buf.length); // ~0..1
    if (levelCb) levelCb(rms);

    const now = Date.now();
    if (rms > 0.04) lastVoiceAt = now;

    if (silenceCb && now > silenceArmedAt && now - lastVoiceAt > silenceMs) {
      silenceCb();
      silenceCb = null; // fire once
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  function stopAnalyser() {
    try { audioCtx.close(); } catch (_) {}
  }

  return {
    onLevel: (fn) => { levelCb = fn; },
    onSilence: (fn, ms = 1500) => { silenceCb = fn; silenceMs = ms; },
    stop: () =>
      new Promise((resolve) => {
        stopResolver = resolve;
        if (recorder.state !== "inactive") recorder.stop();
        else resolve(null);
        stopAnalyser();
      }),
    cancel: () =>
      new Promise((resolve) => {
        cancelled = true;
        stopResolver = resolve;
        if (recorder.state !== "inactive") recorder.stop();
        else resolve(null);
        stopAnalyser();
      }),
    mimeType,
  };
}

/* Send the recorded blob to Groq Whisper via our proxy. */
export async function transcribe(blob, lang) {
  if (!blob || blob.size === 0) return "";

  const ext = blob.type.includes("mp4")
    ? "mp4"
    : blob.type.includes("ogg")
    ? "ogg"
    : "webm";

  const form = new FormData();
  form.append("file", blob, `audio.${ext}`);
  form.append("model", WHISPER_MODEL);
  if (lang) form.append("language", lang); // 'en' | 'fr'
  form.append("response_format", "json");
  form.append("temperature", "0");

  const { url, headers } = endpoint();
  const res = await fetch(url, { method: "POST", headers, body: form });
  if (!res.ok) {
    let msg = `Transcription error ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.error?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  const data = await res.json();
  return (data?.text || "").trim();
}
