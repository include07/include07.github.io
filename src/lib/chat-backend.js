/* chat-backend.js — local-dev stub for the portfolio chat backend.
 *
 * The Chat page calls `window.portfolio.ask({ messages })` and expects a string
 * reply. In production this will be wired to a small proxy (Cloudflare Worker /
 * Vercel edge function / our own K8s service) that forwards to whichever LLM
 * provider we settle on. For local dev we install this stub so the chat surface
 * works offline with no network and no API key.
 *
 * The stub is a small keyword router that picks one of a few canned first-person
 * replies seeded from content.jsx — enough to demo the UI, the orbital
 * highlights, the suggested chips, and the voice loop. */

import C from "../content.jsx";

function pickLang(messages) {
  const sys = messages.find((m) => /Always reply in (French|English)/i.test(m.content || ""));
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
      `**Sawti** is the first **Darija** voice dataset I'm aware of — a crowdsourcing platform we built between ENSAM and ENSIAS. **React** frontend, **Django** API, **PostgreSQL**, **MinIO** for the audio blobs, all containerised and deployed on **Kubernetes** behind **NGINX** with **GitLab** CI shipping every merge. We've collected 1.6h from 465 contributors across Fez–Meknès, Oriental and Tangier.`,
    siana: () =>
      `At **SIANA** (joint-venture ONCF × SNCF) I own the RUL prediction pipeline for the axle fleet of 12 TGV trainsets. I built **SI-ESSIEUX**, the full-stack tracking app the maintenance teams use day-to-day — **React** + **Django** + **PostgreSQL** with real-time dashboards — and I'm running the data collection-to-modelling pipeline on top. Combining anomaly detection with time-series modelling on multi-sensor data, classical ML next to neural baselines.`,
    aiInside: () =>
      `At **AI-Inside** I trained **YOLOv8** detectors for industrial QC defect detection and shipped the platform around them — **QC Management System**, an end-to-end annotation → training → monitoring tool (Docker · React · Flask · PostgreSQL · MinIO). The tangible win was a custom annotation UI that cut data-prep time by 50%.`,
    devops: () =>
      `My DevOps work is concentrated in two places. **QtoDash** is the deepest example — a 5-VM cluster I run end-to-end: **Kubernetes** (3 nodes, HPA, ingress), **GitLab** CI/CD with its registry, **NGINX** as the TLS-terminating reverse proxy, **Terraform** for the VMs, **Prometheus** + **Grafana** for observability. **Sawti** is the second — same K8s + GitLab + NGINX shape, just deployed for the Darija voice-collection app.`,
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
      `**Sawti** c'est le premier dataset vocal en **Darija** — une plateforme participative entre ENSAM et ENSIAS. Frontend **React**, API **Django**, **PostgreSQL**, **MinIO** pour les fichiers audio, le tout containerisé et déployé sur **Kubernetes** derrière **NGINX**, GitLab CI livrant à chaque merge. On a déjà collecté 1,6h auprès de 465 contributeurs (Fès-Meknès, Oriental, Tanger).`,
    siana: () =>
      `Chez **SIANA** (joint-venture ONCF × SNCF) je pilote le pipeline de prédiction RUL sur le parc d'essieux des 12 rames TGV. J'ai conçu **SI-ESSIEUX**, l'application full-stack de suivi utilisée par les équipes maintenance — **React** + **Django** + **PostgreSQL** avec dashboards temps réel — et je gère le pipeline collecte-vers-modélisation par-dessus. Détection d'anomalies + séries temporelles multi-capteurs, ML classique vs réseaux de neurones.`,
    aiInside: () =>
      `Chez **AI-Inside** j'ai entraîné des détecteurs **YOLOv8** pour la détection de défauts en contrôle qualité industriel et livré la plateforme autour — **QC Management System**, un outil bout-en-bout annotation → entraînement → suivi (Docker · React · Flask · PostgreSQL · MinIO). Gain concret : -50% sur le temps de préparation des données grâce à une UI d'annotation sur mesure.`,
    devops: () =>
      `Mon travail DevOps est concentré sur deux projets. **QtoDash**, le plus poussé — un cluster de 5 VMs que je gère de bout en bout : **Kubernetes** (3 nœuds, HPA, ingress), **GitLab** CI/CD + registry, **NGINX** en reverse proxy TLS, **Terraform** pour les VMs, **Prometheus** + **Grafana** pour l'observabilité. **Sawti** est le second — même topologie K8s + GitLab + NGINX, déployée pour la collecte vocale en darija.`,
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
  if (/ai-?inside|yolo|qc management|defect|défaut/.test(lo)) return t.aiInside();
  if (/devops|kubernetes|k8s|gitlab|infra|cluster/.test(lo)) return t.devops();
  if (/(why|pourquoi).*(ai|ia|devops|ml)/.test(lo)) return t.why();
  if (/strong(est)?|best|meilleur|favori/.test(lo)) return t.strongest();
  if (/(available|hire|hiring|disponib|emploi|recru)/.test(lo)) return t.available();
  if (/^(hi|hey|hello|salut|bonjour|coucou)/.test(lo)) {
    return lang === "fr"
      ? "Salut ! Posez-moi une question — projets, infra, IA, dispo. " + t.fallback()
      : "Hey! Ask me anything — projects, infra, AI, availability. " + t.fallback();
  }
  if (/\b(ai|ml|machine learning|ia|apprentissage)\b/.test(lo)) return t.ai();
  return t.fallback();
}

export function installChatBackend() {
  if (typeof window === "undefined") return;
  if (window.portfolio && typeof window.portfolio.ask === "function") return;
  window.portfolio = window.portfolio || {};
  window.portfolio.ask = async function ask({ messages }) {
    // Soft delay so the typing indicator isn't a flicker.
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
