/* persona.js — additional biographical facts that complement content.jsx.
 *
 * Treat everything in here as public-safe context: facts the chat agent
 * may reference verbatim. No internal strategy, no coaching, no notes
 * about "what to claim vs. soften". If a fact would be embarrassing if
 * quoted by a visitor, do not put it here.
 *
 * Both languages mirror each other. Keep edits in sync.
 */

export const PERSONA_NOTES = {
  en: `
POSITIONING
- Role: AI & full-stack engineer for industry. Coverage spans the full software lifecycle: needs analysis, ML/DS modelling, web app development (React/Django/Flask), and deployment.

SIANA — final-year project (PFE), Tangier, since Feb 2026
- Joint-venture ONCF × SNCF, axle-maintenance digitalization for 12 TGV trainsets (366 axles).
- Owned the full lifecycle: requirements & AS-IS analysis, TO-BE design, CdCF (BPMN, UML, UX/UI, permissions, migration strategy), built SI-ESSIEUX (React/TypeScript + Django + SQL Server), set up the automated RUL training pipeline, prepared test/recette and progressive deployment with double-entry.
- The RUL pipeline uses survival analysis and gradient boosting on engineered features from inspection-interval data. Deep learning approaches like LSTMs are not appropriate here because the data is censored inspection intervals, not rich sensor streams.
- CI/CD runs on GitLab CI.

AI-INSIDE — Jul–Sep 2025, remote / Kénitra
- Trained YOLOv8 defect detectors deployed to production in industrial QC.
- Built QC Management System: Docker + React + Flask + PostgreSQL + MinIO. Integrated annotation, training, monitoring.
- Custom annotation app streamlined the team's data-preparation workflow.

JESA — Jul–Sep 2024, Casablanca
- Automated API 650 tank-sizing calculations in Python. Cross-team calculation flows (civil, electrical, process).

QTODASH — personal infrastructure project, in active build-out
- Voice-first analytics platform. Target architecture: self-hosted on a 5-VM cluster — 1 GitLab CI/CD node, 1 NGINX reverse proxy, 3-node Kubernetes cluster (API, ASR worker, dashboard renderer).
- Current state: text-mode build live at app.qtodash.tech. The full topology is being stood up; Terraform, Prometheus, Grafana are part of the target stack.

SAWTI — backend engineer at sawti.dev
- Crowdsourced Moroccan-Darija voice corpus for ASR research.
- Scope: built the Flask API and PostgreSQL schema powering contribution flows.
- Scale: 465 recordings, 619 texts, 1.6h of speech, 3 regions.

SMART INSPECTION ROBOT — Innov'AM 2025, 1st place
- Team project; I was project manager + team member.
- Autonomous prototype with on-device YOLOv8 on a Raspberry Pi for real-time rail-defect detection. Full mechanical, electrical and embedded design across the team.

TURBO-FAN PREDICTIVE MAINTENANCE — academic team project
- NASA C-MAPSS multi-sensor dataset. Compared classical ML and LSTM baselines.

SEGMAVISIONPRO — solo academic project
- Language-guided segmentation (Grounding DINO) served on NVIDIA Triton with batched post-processing for low-latency inference.

VOICE CLONE — personal R&D, in progress
- Fine-tuning Coqui XTTS-v2 on personal voice recordings for the spoken-portfolio agent.

DISTINCTIONS
- 5 distinct awards. The 2nd-place NDSC (EMINES, Feb 2025) was the Voice Privacy Challenge (VPC25) — one event.
- 1337 Khouribga 2022: mentor role at the Moroccan National Programming Contest.

EDUCATION
- ENSAM Meknès, 2020–2026: State Engineer — Industrial Engineering, AI & Data Science option.
- UEMF (Université Euromed de Fès), 2019–2020: EIDIA, Math & Computer Science prep year.
- Lycée Moulay Bouchaïb, Azemmour, 2018–2019: Baccalauréat — Sciences Physiques.

CURRENT LOCATION & AVAILABILITY
- Based in Tangier (SIANA placement). Open to relocation. Available from August 2026.
- Trilingual: Arabic (native), French (TCF C2), English (TOEFL C1).
`,

  fr: `
POSITIONNEMENT
- Rôle : ingénieur IA & full-stack pour l'industrie. Couverture du cycle logiciel complet : analyse du besoin, modélisation ML/DS, développement d'applications web (React/Django/Flask), déploiement.

SIANA — PFE, Tanger, depuis fév. 2026
- Joint-venture ONCF × SNCF, digitalisation de la maintenance des essieux pour 12 rames TGV (366 essieux).
- Cycle complet : analyse du besoin & AS-IS, conception TO-BE, CdCF (BPMN, UML, UX/UI, permissions, stratégie de migration), développement de SI-ESSIEUX (React/TypeScript + Django + SQL Server), pipeline RUL automatisé, préparation tests/recette et déploiement progressif en double saisie.
- Le pipeline RUL utilise l'analyse de survie et le gradient boosting sur des features ingénierées issues de données d'intervalles d'inspection. Les approches deep learning type LSTM ne conviennent pas : les données sont des intervalles d'inspection censurés, pas des flux capteurs riches.
- CI/CD via GitLab CI.

AI-INSIDE — juil.–sep. 2025, remote / Kénitra
- Entraînement de détecteurs YOLOv8 déployés en production en contrôle qualité industriel.
- Développement de QC Management System : Docker + React + Flask + PostgreSQL + MinIO. Annotation, entraînement, monitoring intégrés.
- Application d'annotation sur mesure ayant rationalisé la préparation des données de l'équipe.

JESA — juil.–sep. 2024, Casablanca
- Automatisation en Python du dimensionnement de réservoirs (norme API 650). Flux de calcul inter-équipes (civil, électrique, procédés).

QTODASH — projet d'infrastructure personnel, en montée en charge
- Plateforme analytique voice-first. Architecture cible : auto-hébergée sur un cluster 5 VMs — 1 nœud GitLab CI/CD, 1 reverse proxy NGINX, cluster Kubernetes 3 nœuds (API, worker ASR, rendu dashboards).
- État actuel : build texte en ligne sur app.qtodash.tech. La topologie complète est en cours de mise en place ; Terraform, Prometheus, Grafana font partie du stack cible.

SAWTI — ingénieur backend sur sawti.dev
- Corpus vocal participatif en darija marocaine pour la recherche ASR.
- Périmètre : API Flask et schéma PostgreSQL alimentant les flux de contribution.
- Volume : 465 enregistrements, 619 textes, 1,6h de parole, 3 régions.

ROBOT D'INSPECTION INTELLIGENTE — Innov'AM 2025, 1ʳᵉ place
- Projet d'équipe ; rôle de chef de projet + membre.
- Prototype autonome avec YOLOv8 embarqué sur Raspberry Pi pour la détection de défauts ferroviaires en temps réel. Conception mécanique, électrique et embarquée portée collectivement.

MAINTENANCE PRÉDICTIVE TURBO-FAN — projet d'équipe académique
- Jeu de données NASA C-MAPSS multi-capteurs. Comparaison ML classique et baselines LSTM.

SEGMAVISIONPRO — projet académique solo
- Segmentation guidée par le langage (Grounding DINO) servie sur NVIDIA Triton avec post-traitement batché pour une inférence à basse latence.

CLONE VOCAL — R&D personnel, en cours
- Fine-tuning de Coqui XTTS-v2 sur enregistrements personnels pour l'agent vocal du portfolio.

DISTINCTIONS
- 5 distinctions distinctes. Le 2ᵉ au NDSC (EMINES, fév. 2025) correspond au Voice Privacy Challenge (VPC25) — même événement.
- 1337 Khouribga 2022 : rôle de mentor au Moroccan National Programming Contest.

FORMATION
- ENSAM Meknès, 2020–2026 : Ingénieur d'État — Génie Industriel, option IA & Data Science.
- UEMF (Université Euromed de Fès), 2019–2020 : EIDIA, année préparatoire Mathématiques & Informatique.
- Lycée Moulay Bouchaïb, Azemmour, 2018–2019 : Baccalauréat — Sciences Physiques.

LOCALISATION & DISPONIBILITÉ
- Basé à Tanger (placement SIANA). Ouvert à la mobilité. Disponible à partir d'août 2026.
- Trilingue : arabe (natif), français (TCF C2), anglais (TOEFL C1).
`,
};
