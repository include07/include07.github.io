/* chat-backend.js
 *
 * - If a Groq API key is configured locally, chat uses Groq live.
 * - Otherwise it falls back to the local keyword stub.
 *
 * Key handling is intentionally local-only to avoid exposing secrets in repo:
 * window.portfolio.setGroqKey("gsk_...") stores it in localStorage.
 */

import C from "../content.jsx";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const LS_KEY = "portfolio.groq.apiKey";

function pickLang(messages) {
  const sys = messages.find((m) =>
    /Always reply in (French|English)/i.test(m.content || ""),
  );
  if (sys && /French/i.test(sys.content)) return "fr";
  return "en";
}

function lastUser(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

const TEMPLATES = {
  en: {
    qtodash: () =>
      `**QtoDash** is my voice-first analytics platform — you ask a business question out loud and a dashboard shows up. The fun part for me is the infrastructure: I self-host the whole thing on a 5-VM cluster — one **GitLab** runner doing CI/CD and the registry, one **NGINX** node terminating TLS, and a 3-node **Kubernetes** cluster running the API, the ASR worker and the dashboard renderer.\n\nIt's where I get to wear the DevOps hat: **Terraform** for the VMs, **Prometheus** + **Grafana** for observability, GitLab pipelines that build, push and roll out on every merge.`,
    sawti: () =>
      `**Sawti** is a crowdsourcing platform for Moroccan **Darija** speech data. We built it with **React**, **Flask**, and **PostgreSQL** to collect voice and text contributions for ASR research. Current impact: 465 voice contributions, 619 text contributions, 1.6h recorded across 3 regions.`,
    siana: () =>
      `At **SIANA** (joint-venture ONCF × SNCF), my final project is industrial process digitalization for axle maintenance on 12 TGV trainsets (366 axles). I led requirements and AS-IS analysis, then TO-BE design and CdCF formalization, and built **SI-ESSIEUX** (**React/TypeScript** + **Django** + **SQL Server**). I also implemented an automated **RUL** training pipeline from data prep to re-training, and prepared test/acceptance plus progressive rollout.`,
    aiInside: () =>
      `At **AI-Inside** I trained **YOLOv8** detectors for industrial QC defect detection and shipped the platform around them — **QC Management System**, an end-to-end annotation → training → monitoring tool (Docker · React · Flask · PostgreSQL · MinIO). The tangible win was a custom annotation UI that cut data-prep time by 50%.`,
    devops: () =>
      `My DevOps work is concentrated around **QtoDash**: a 5-VM setup I run end-to-end with **Kubernetes** (3 nodes, HPA, ingress), **GitLab** CI/CD + registry, **NGINX** reverse proxy, **Terraform** provisioning, and **Prometheus** + **Grafana** observability.`,
    ai: () =>
      `My ML work spans three angles. Predictive maintenance at **SIANA** — RUL on 12 TGV axles, time series + anomaly detection. Industrial computer vision at **AI-Inside** — **YOLOv8** defect detection in QC. And the side projects: **Grounding DINO** on **NVIDIA Triton** (SegmaVisionPro), an Innov'AM-winning rail-defect inspection robot running YOLOv8 on a Raspberry Pi, and a **PyTorch** voice-clone fine-tune that powers this very page.`,
    available: () =>
      `Yes — I graduate from ENSAM Meknès in summer 2026 and I'm open to first full-time roles starting **August 2026**. AI/ML or DevOps / platform engineering, ideally a place where the two overlap. Best email is j.elfirqi@gmail.com.`,
    why: () =>
      `Honestly, because I keep ending up where they meet. Training a model is half the job — the other half is the platform that ships it, the registry that hosts it, the cluster that runs it, the dashboard that watches it. So it made sense to learn both sides instead of pretending one of them isn't there.`,
    strongest: () =>
      `Probably **QtoDash** — it's the deepest end-to-end thing I've shipped solo. Voice-first analytics, but the part I'm proudest of is the cluster underneath: **Kubernetes** + **GitLab** + **NGINX** all wired by hand on bare-metal VMs with **Terraform** and observability through **Prometheus** + **Grafana**. The Innov'AM-winning inspection robot is a close second — different stack (YOLOv8 on a Raspberry Pi, mechanical + electrical design) but the most fun to demo.`,
    fallback: () =>
      `Happy to dig into anything specific — projects, the QtoDash infra, my SIANA work on TGV axles, the AI-Inside YOLOv8 platform, or what I'm looking for in 2026. What angle interests you?`,
  },
  fr: {
    qtodash: () =>
      `**QtoDash** c'est ma plateforme analytique voice-first — vous posez une question à voix haute et un dashboard apparaît. Le plus intéressant pour moi c'est l'infra : tout auto-hébergé sur un cluster de 5 VMs — un runner **GitLab** pour la CI/CD et le registry, un nœud **NGINX** qui termine le TLS, et un cluster **Kubernetes** à 3 nœuds qui orchestre l'API, le worker ASR et le rendu des dashboards.\n\n**Terraform** pour les VMs, **Prometheus** + **Grafana** pour l'observabilité, des pipelines GitLab qui buildent, poussent et déploient à chaque merge.`,
    sawti: () =>
      `**Sawti** est une plateforme participative de collecte de données vocales en **Darija** pour la recherche ASR. Nous l'avons réalisée avec **React**, **Flask** et **PostgreSQL** pour collecter des contributions voix et textes. Impact actuel : 465 contributions voix, 619 contributions textes, 1,6h enregistrée sur 3 régions.`,
    siana: () =>
      `Chez **SIANA** (joint-venture ONCF × SNCF), mon PFE porte sur la digitalisation des processus de maintenance des essieux de 12 rames TGV (366 essieux). J'ai mené la définition du besoin et l'analyse AS-IS, puis la conception TO-BE et la formalisation du CdCF, avant de développer **SI-ESSIEUX** (**React/TypeScript** + **Django** + **SQL Server**). J'ai aussi mis en place un pipeline d'entraînement automatique **RUL** et préparé la phase test/recette avec déploiement progressif.`,
    aiInside: () =>
      `Chez **AI-Inside** j'ai entraîné des détecteurs **YOLOv8** pour la détection de défauts en contrôle qualité industriel et livré la plateforme autour — **QC Management System**, un outil bout-en-bout annotation → entraînement → suivi (Docker · React · Flask · PostgreSQL · MinIO). Gain concret : -50% sur le temps de préparation des données grâce à une UI d'annotation sur mesure.`,
    devops: () =>
      `Mon travail DevOps est surtout concentré sur **QtoDash** : une architecture 5 VMs gérée de bout en bout avec **Kubernetes** (3 nœuds, HPA, ingress), **GitLab** CI/CD + registry, **NGINX** en reverse proxy TLS, **Terraform** pour le provisionnement, et **Prometheus** + **Grafana** pour l'observabilité.`,
    ai: () =>
      `Mon travail ML couvre trois angles. Maintenance prédictive chez **SIANA** — RUL sur 12 essieux TGV, séries temporelles + détection d'anomalies. Vision industrielle chez **AI-Inside** — **YOLOv8** pour la détection de défauts en QC. Et les projets persos : **Grounding DINO** sur **NVIDIA Triton** (SegmaVisionPro), un robot d'inspection ferroviaire (Innov'AM) en **YOLOv8** embarqué sur Raspberry Pi, et un fine-tuning **PyTorch** de clone vocal qui alimente cette page.`,
    available: () =>
      `Oui — je termine l'ENSAM Meknès à l'été 2026 et je suis ouvert à un premier poste à partir d'**août 2026**. IA/ML ou DevOps / ingénierie de plateforme, idéalement quelque chose à l'intersection des deux. Meilleur contact : j.elfirqi@gmail.com.`,
    why: () =>
      `Honnêtement parce que je finis toujours là où les deux se rencontrent. Entraîner un modèle c'est la moitié du job — l'autre moitié c'est la plateforme qui le livre, le registry qui l'héberge, le cluster qui le fait tourner, le dashboard qui le surveille. Autant apprendre les deux côtés.`,
    strongest: () =>
      `Sans doute **QtoDash** — c'est ce que j'ai shippé seul de plus complet. Voice-first analytics, mais ce dont je suis le plus fier c'est l'infra en dessous : **Kubernetes** + **GitLab** + **NGINX** câblés à la main sur des VMs bare-metal, avec **Terraform** et de l'observabilité via **Prometheus** + **Grafana**. Le robot d'inspection ferroviaire (Innov'AM) arrive juste derrière — stack très différente (YOLOv8 sur Raspberry Pi, conception méca + électrique) mais le plus fun à démontrer.`,
    fallback: () =>
      `Avec plaisir d'approfondir n'importe quel sujet — projets, l'infra QtoDash, le travail à SIANA sur les essieux TGV, la plateforme YOLOv8 d'AI-Inside, ou ce que je cherche pour 2026. Quel angle vous intéresse ?`,
  },
};

function route(text, lang) {
  const lo = (text || "").toLowerCase();
  const t = TEMPLATES[lang] || TEMPLATES.en;
  if (/qtodash|qto-dash|qto dash/.test(lo)) return t.qtodash();
  if (/sawti|darija/.test(lo)) return t.sawti();
  if (/siana|tgv|axle|essieu/.test(lo)) return t.siana();
  if (/ai-?inside|yolo|qc management|defect|défaut/.test(lo))
    return t.aiInside();
  if (/devops|kubernetes|k8s|gitlab|infra|cluster/.test(lo)) return t.devops();
  if (/(why|pourquoi).*(ai|ia|devops|ml)/.test(lo)) return t.why();
  if (/strong(est)?|best|meilleur|favori/.test(lo)) return t.strongest();
  if (/(available|hire|hiring|disponib|emploi|recru)/.test(lo))
    return t.available();
  if (/^(hi|hey|hello|salut|bonjour|coucou)/.test(lo)) {
    return lang === "fr"
      ? "Salut ! Posez-moi une question — projets, infra, IA, dispo. " +
          t.fallback()
      : "Hey! Ask me anything — projects, infra, AI, availability. " +
          t.fallback();
  }
  if (/\b(ai|ml|machine learning|ia|apprentissage)\b/.test(lo)) return t.ai();
  return t.fallback();
}

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
    return getGroqKey() ? "groq" : "local-stub";
  };

  window.portfolio.ask = async function ask({ messages }) {
    const apiKey = getGroqKey();

    if (apiKey) {
      return await askGroq(messages, apiKey);
    }

    await new Promise((r) => setTimeout(r, 350 + Math.random() * 300));
    const lang = pickLang(messages);
    const userText = lastUser(messages);
    return route(userText, lang);
  };
}

// Re-export the bilingual content so the system-prompt builder has the same
// shape it had against window.PORTFOLIO in the original code.
export function getPortfolio(lang) {
  return C[lang] || C.en;
}
