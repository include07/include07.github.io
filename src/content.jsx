/* content.jsx — bilingual portfolio content (EN/FR) */
const C = {
  en: {
    nav: [
      { h: "#experience", l: "Experience" },
      { h: "#projects", l: "Projects" },
      { h: "#skills", l: "Skills" },
      { h: "#awards", l: "Awards" },
      { h: "#education", l: "Education" },
      { h: "#contact", l: "Contact" },
    ],
    mark: "J·EF / Portfolio · 26",
    location: "Meknès, Morocco",
    available: "Available · Aug 2026",
    role: "AI · Full-Stack Engineer",
    field: "ML · Full-stack · End-to-end delivery",
    name: { a: "Jalaleddin", b: "El Firqi" },
    lede: (
      <>
        AI & full-stack engineer from <em>ENSAM Meknès</em>. I deliver{" "}
        <em>industrial software end-to-end</em> — from needs analysis to
        deployment — building <em>ML systems</em> for predictive maintenance
        and computer vision (<em>SIANA</em>, <em>AI-Inside</em>) and the web
        platforms that put them in operators' hands (<em>SI-ESSIEUX</em>,{" "}
        <em>QC Management System</em>, <em>QtoDash</em>).
      </>
    ),
    actions: [
      { kind: "primary", label: "Download CV", arr: "↓" },
      { kind: "ghost", label: "Email me", arr: "→" },
      { kind: "ghost", label: "GitHub", arr: "↗" },
    ],
    stats: [
      { v: "3×", l: "Industry roles" },
      { v: "6", l: "Built projects" },
      { v: "5×", l: "Awards & top finishes" },
    ],
    marquee: [
      "Kubernetes",
      "GitLab CI",
      "Predictive maintenance",
      "Docker",
      "YOLOv8",
      "NVIDIA Triton",
      "scikit-learn",
      "XGBoost",
      "Django",
      "React",
      "Anomaly detection",
      "MLOps",
    ],

    sections: {
      experience: {
        num: "01",
        title: (
          <>
            Professional <em>experience.</em>
          </>
        ),
        meta: "3 roles · 2024 — present",
      },
      projects: {
        num: "02",
        title: (
          <>
            Selected <em>projects.</em>
          </>
        ),
        meta: "6 of many · 2024 — 2026",
      },
      skills: {
        num: "03",
        title: (
          <>
            Tools & <em>methods.</em>
          </>
        ),
        meta: "Stack · last 2 years",
      },
      awards: {
        num: "04",
        title: (
          <>
            Awards & <em>distinctions.</em>
          </>
        ),
        meta: "2022 — 2025",
      },
      education: { num: "05", title: <>Formation.</>, meta: "2018 — 2026" },
      contact: { num: "06" },
    },

    experiences: [
      {
        co: "SIANA",
        coNote: "Joint-Venture ONCF × SNCF",
        when: "Feb 2026 — Present",
        duration: "6 mo",
        where: "Tangier, Morocco",
        role: "Industrial Process Digitalization Engineer (Final Project)",
        focus: "Rail maintenance digitalization",
        lede: (
          <>
            Led the end-to-end digitalization lifecycle for axle maintenance,
            from requirement definition to design, implementation, and rollout
            preparation for <strong>12 TGV trainsets (366 axles)</strong>.
          </>
        ),
        bullets: [
          <>
            Ran the requirements and AS-IS analysis phase through field
            interviews, process mapping and operational data-flow assessment.
          </>,
          <>
            Drove TO-BE design and formalised the <b>CdCF</b> (BPMN, UML, UX/UI,
            permissions and migration strategy) for traceable SEF-critical
            operations.
          </>,
          <>
            Built <b>SI-ESSIEUX</b>, a mobile-first web application
            (React/TypeScript · Django · SQL Server) covering consultation,
            operation entry, maintenance decision and history.
          </>,
          <>
            Implemented an <b>automated RUL training pipeline</b>{" "}
            (survival analysis & gradient boosting on inspection-interval
            data), from data preparation to re-training, to improve maintenance
            decision reliability.
          </>,
          <>
            Prepared test/acceptance and progressive deployment (double entry),
            with auditable rules for production rollout without regression.
          </>,
        ],
        metrics: [
          { v: "12", l: "TGV trainsets" },
          { v: "366", l: "Axles tracked" },
        ],
        stack: [
          "Django",
          "React",
          "SQL Server",
          "Python",
          "scikit-learn",
          "GitLab CI",
          "BPMN",
          "UML",
        ],
        kStack: ["Python", "GitLab"],
      },
      {
        co: "AI-Inside",
        coNote: "Private",
        when: "Jul 2025 — Sep 2025",
        duration: "2 mo",
        where: "Remote · Kénitra, Morocco",
        role: "Machine Learning Engineer",
        focus: "Industrial Computer Vision",
        lede: (
          <>
            Trained{" "}
            <strong>YOLOv8 models for automatic defect detection</strong> in
            industrial QC and shipped the platform that now powers their
            annotation-to-deployment workflow.
          </>
        ),
        bullets: [
          <>
            Built <b>QC Management System</b> — integrated annotation, training
            and model-monitoring platform (Docker · React · Flask · PostgreSQL ·
            MinIO).
          </>,
          <>
            Streamlined the team's data-prep workflow with a{" "}
            <b>custom image-annotation app</b> tailored to their labelling
            conventions.
          </>,
          <>
            Tuned YOLOv8 detectors against real production imagery; iterated on
            augmentation and post-processing.
          </>,
        ],
        metrics: [
          { v: "Custom", l: "Annotation tooling" },
          { v: "YOLOv8", l: "Production defect detection" },
        ],
        stack: ["YOLOv8", "Docker", "Flask", "React", "PostgreSQL", "MinIO"],
        kStack: ["YOLOv8", "Docker"],
      },
      {
        co: "JESA",
        coNote: "Joint-Venture OCP × Worley",
        when: "Jul 2024 — Sep 2024",
        duration: "2 mo",
        where: "Casablanca, Morocco",
        role: "Automation & Process Engineer",
        focus: "Engineering automation",
        lede: (
          <>
            Automated <strong>API 650 tank-sizing calculations</strong> in
            Python, reducing turnaround and improving the reliability of
            cross-discipline deliverables.
          </>
        ),
        bullets: [
          <>
            Modelled and automated <b>cross-team calculation flows</b> — civil,
            electrical, process — to reduce design iterations.
          </>,
          <>
            Hardened deliverables with input validation, traceable assumptions,
            and unit-tested formulae.
          </>,
        ],
        metrics: [
          { v: "API 650", l: "Tank-sizing automated" },
          { v: "3", l: "Disciplines coordinated" },
        ],
        stack: ["Python", "Engineering", "Process modelling"],
        kStack: ["Python"],
      },
    ],

    projects: [
      {
        feat: true,
        num: "01",
        kind: "Personal infrastructure project · in progress",
        award: "Shipping",
        link: "qtodash.tech",
        image: "/projects/qtodash.png",
        title: (
          <>
            Qto<span className="it">Dash</span> — voice‑powered AI dashboards.
          </>
        ),
        body: "Voice‑first analytics platform that turns spoken business questions into instant dashboards. Early text‑mode build is live at app.qtodash.tech while I bring up the full target architecture: end‑to‑end self‑hosted on a 5‑VM cluster — 1 GitLab CI/CD node, 1 NGINX reverse proxy, and a 3‑node Kubernetes cluster orchestrating the API, ASR worker and dashboard renderer.",
        infra: [
          { k: "GitLab", v: "CI/CD · registry · IaC" },
          { k: "Reverse proxy", v: "NGINX · TLS · routing" },
          { k: "Kubernetes", v: "3‑node cluster · HPA · ingress" },
        ],
        tags: [
          "Kubernetes",
          "GitLab CI",
          "Docker",
          "NGINX",
          "Terraform",
          "Prometheus",
          "Grafana",
          "Python",
          "React",
        ],
        ph: "qtodash.tech · K8s topology",
      },
      {
        feat: true,
        num: "02",
        kind: "Backend engineering · Sawti (ASR data platform)",
        link: "sawti.dev",
        image: "/projects/sawti.png",
        title: (
          <>
            Sawti — crowdsourced <span className="it">Darija</span> voice corpus.
          </>
        ),
        body: "Backend engineer on a crowdsourced platform building a Moroccan-Darija speech corpus for ASR research. Designed and shipped the Flask API and PostgreSQL schema powering contribution flows, with structured collection of voice and text submissions across regions.",
        infra: [
          { k: "Scale", v: "465 recordings · 619 texts" },
          { k: "Coverage", v: "1.6h recorded · 3 regions" },
          { k: "Stack", v: "React · Flask · PostgreSQL" },
        ],
        tags: ["React", "Flask", "PostgreSQL", "ASR", "Data collection"],
        ph: "sawti.dev · contributors map",
      },
      {
        num: "03",
        kind: "ENSAM × SIANA (ONCF/SNCF) · team project · project manager",
        award: "1st place",
        image: "/projects/robot.jpg",
        title: (
          <>
            Smart <span className="it">inspection</span> robot.
          </>
        ),
        body: "Team project (project manager + member) — an autonomous prototype that detects rail defects in real time via on-device YOLOv8 on a Raspberry Pi. Full mechanical, electrical and embedded design across the team.",
        tags: [
          "YOLOv8",
          "Raspberry Pi",
          "SolidWorks",
          "Fusion 360",
          "AutoCAD Electrical",
        ],
        ph: "robot · field photo",
      },
      {
        num: "04",
        kind: "Academic · ENSAM Meknès · team project",
        title: (
          <>
            Turbo-fan <span className="it">predictive</span> maintenance.
          </>
        ),
        body: "RUL estimation on NASA's C-MAPSS multi-sensor turbofan dataset; feature engineering on time series and head-to-head comparison of classical ML against LSTM baselines.",
        tags: ["Time series", "PyTorch", "Feature eng."],
        ph: "sensor traces",
      },
      {
        num: "05",
        kind: "Industrial vision pipeline · ENSAM",
        image: "/projects/segma.png",
        title: (
          <>
            SegmaVision<span className="it">Pro</span>.
          </>
        ),
        body: "Language-guided segmentation pipeline (Grounding DINO) served on NVIDIA Triton with batched post-processing to keep inference latency low.",
        tags: ["Grounding DINO", "NVIDIA Triton", "OpenCV"],
        ph: "segmentation diagram",
      },
      {
        num: "06",
        kind: "Personal R&D · in progress",
        title: (
          <>
            Personal voice <span className="it">clone</span>.
          </>
        ),
        body: "Fine-tuning Coqui XTTS-v2 on my own voice recordings to power the spoken-portfolio agent on this very page — the voice layer of the conversational interface.",
        tags: ["Coqui XTTS-v2", "PyTorch", "Python", "TTS", "Voice cloning"],
        ph: "waveform · voice fine-tune",
      },
    ],

    skills: [
      {
        g: "Data Science & ML",
        items: [
          "Python",
          "scikit-learn",
          "XGBoost",
          "pandas / NumPy",
          "PyTorch",
          "MLflow",
          "Time series",
          "Predictive maintenance",
          "Anomaly detection",
        ],
      },
      {
        g: "Industrial Computer Vision",
        items: ["YOLOv8", "NVIDIA Triton", "Python", "OpenCV"],
      },
      {
        g: "Engineering & IoT",
        items: [
          "AutoCAD Electrical",
          "Raspberry Pi",
          "SolidWorks",
          "Fusion 360",
          "Embedded prototyping (sensors · hardware integration)",
        ],
      },
      {
        g: "Industrialisation & MLOps",
        items: [
          "Docker",
          "Kubernetes",
          "NGINX",
          "CI/CD",
          "GitLab",
          "Git",
          "Bash",
          "Linux",
          "PostgreSQL",
          "Prometheus",
          "Grafana",
        ],
      },
      {
        g: "Web / Apps",
        items: [
          "React",
          "TypeScript",
          "Django",
          "Flask",
          "SQL Server",
          "MinIO",
        ],
      },
      {
        g: "Languages",
        items: ["Arabic — native", "French — TCF C2", "English — TOEFL C1"],
        lang: true,
      },
    ],

    awards: [
      {
        rank: "1ˢᵗ",
        label: (
          <>
            Innov'AM 25 — Forum Entreprises <em>Arts & Métiers</em>
          </>
        ),
        when: "Jun 2025",
      },
      {
        rank: "1ˢᵗ",
        label: (
          <>
            Success Spark 2025 — <em>Enactus ENSAM Meknès</em>
          </>
        ),
        when: "Jun 2025",
      },
      {
        rank: "2ⁿᵈ",
        label: (
          <>
            NDSC · Voice Privacy Challenge — <em>EMINES</em>
          </>
        ),
        when: "Feb 2025",
      },
      {
        rank: "5ᵗʰ",
        label: (
          <>
            UPF Coding Challenge — <em>UPF</em>
          </>
        ),
        when: "May 2024",
      },
      {
        rank: "·",
        label: (
          <>
            Moroccan National Programming Contest —{" "}
            <em>1337 Khouribga, mentor</em>
          </>
        ),
        when: "2022",
      },
    ],

    education: [
      {
        when: "2020 — 2026",
        h: "State Engineer — Industrial Engineering, AI & Data Science option",
        where: "ENSAM Meknès · Morocco",
      },
      {
        when: "2019 — 2020",
        h: "EIDIA — Math & Computer Science (prep year)",
        where: "UEMF (Université Euromed de Fès) · Morocco",
      },
      {
        when: "2018 — 2019",
        h: "Baccalauréat — Sciences Physiques",
        where: "Lycée Moulay Bouchaïb · Azemmour",
      },
    ],

    contact: {
      title: (
        <>
          Let's <em>build</em> something.
        </>
      ),
      lede: "Open to first full-time roles in AI/ML and full-stack engineering — end-to-end industrial software, from ML to product — starting August 2026.",
      rows: [
        { k: "Email", v: "j.elfirqi@gmail.com" },
        { k: "Phone", v: "+212 675 832 110" },
        { k: "Location", v: "Tangier, Morocco · open to relocation" },
        { k: "GitHub", v: "github.com/include07" },
        { k: "LinkedIn", v: "linkedin.com/in/<handle-pending>" },
      ],
    },
    footer: ["© 2026 Jalaleddin El Firqi", "Designed & built in Meknès"],
    a11y: { theme: "Toggle theme", lang: "Toggle language" },
  },

  fr: {
    nav: [
      { h: "#experience", l: "Expérience" },
      { h: "#projects", l: "Projets" },
      { h: "#skills", l: "Compétences" },
      { h: "#awards", l: "Distinctions" },
      { h: "#education", l: "Formation" },
      { h: "#contact", l: "Contact" },
    ],
    mark: "J·EF / Portfolio · 26",
    location: "Meknès, Maroc",
    available: "Disponible · Août 2026",
    role: "Ingénieur IA · Full-Stack",
    field: "ML · Full-stack · Livraison de bout en bout",
    name: { a: "Jalaleddin", b: "El Firqi" },
    lede: (
      <>
        Ingénieur IA & full-stack issu de <em>l'ENSAM Meknès</em>. Je livre
        des <em>logiciels industriels de bout en bout</em> — de l'analyse du
        besoin au déploiement — en concevant des <em>systèmes ML</em> pour la
        maintenance prédictive et la vision (<em>SIANA</em>,{" "}
        <em>AI-Inside</em>) et les plateformes web qui les mettent dans les
        mains des opérateurs (<em>SI-ESSIEUX</em>,{" "}
        <em>QC Management System</em>, <em>QtoDash</em>).
      </>
    ),
    actions: [
      { kind: "primary", label: "Télécharger le CV", arr: "↓" },
      { kind: "ghost", label: "M'écrire", arr: "→" },
      { kind: "ghost", label: "GitHub", arr: "↗" },
    ],
    stats: [
      { v: "3×", l: "Postes en industrie" },
      { v: "6", l: "Projets aboutis" },
      { v: "5×", l: "Distinctions & podiums" },
    ],
    marquee: [
      "Kubernetes",
      "GitLab CI",
      "Maintenance prédictive",
      "Docker",
      "YOLOv8",
      "NVIDIA Triton",
      "scikit-learn",
      "XGBoost",
      "Django",
      "React",
      "Détection d'anomalies",
      "MLOps",
    ],

    sections: {
      experience: {
        num: "01",
        title: (
          <>
            Expérience <em>professionnelle.</em>
          </>
        ),
        meta: "3 postes · 2024 — présent",
      },
      projects: {
        num: "02",
        title: (
          <>
            Projets <em>sélectionnés.</em>
          </>
        ),
        meta: "6 parmi d'autres · 2024 — 2026",
      },
      skills: {
        num: "03",
        title: (
          <>
            Outils & <em>méthodes.</em>
          </>
        ),
        meta: "Stack · ces 2 dernières années",
      },
      awards: {
        num: "04",
        title: (
          <>
            Distinctions & <em>concours.</em>
          </>
        ),
        meta: "2022 — 2025",
      },
      education: { num: "05", title: <>Formation.</>, meta: "2018 — 2026" },
      contact: { num: "06" },
    },

    experiences: [
      {
        co: "SIANA",
        coNote: "Joint-Venture ONCF × SNCF",
        when: "Fév 2026 — présent",
        duration: "6 mois",
        where: "Tanger, Maroc",
        role: "Ingénieur en Digitalisation des Processus Industriels (PFE)",
        focus: "Digitalisation de la maintenance ferroviaire",
        lede: (
          <>
            Pilotage du cycle complet de digitalisation de la maintenance des
            essieux, de la définition du besoin jusqu'à la préparation du
            déploiement pour <strong>12 rames TGV (366 essieux)</strong>.
          </>
        ),
        bullets: [
          <>
            Conduite de la phase de définition du besoin et d'analyse de
            l'existant via entretiens métier, cartographie des processus et
            analyse des flux opérationnels.
          </>,
          <>
            Pilotage de la conception TO-BE et formalisation du <b>CdCF</b>{" "}
            (BPMN, UML, UX/UI, permissions et stratégie de migration) pour les
            opérations critiques SEF.
          </>,
          <>
            Développement de <b>SI-ESSIEUX</b>, application web mobile-first
            (React/TypeScript · Django · SQL Server) couvrant consultation,
            saisie d'opérations, décision de maintenance et historique.
          </>,
          <>
            Mise en place d'un <b>pipeline d'entraînement automatique RUL</b>{" "}
            (analyse de survie & gradient boosting sur données d'inspection),
            de la préparation des données au réentraînement des modèles.
          </>,
          <>
            Préparation de la phase test & recette et du déploiement progressif
            (double saisie) pour une mise en production sans régression.
          </>,
        ],
        metrics: [
          { v: "12", l: "Rames TGV" },
          { v: "366", l: "Essieux suivis" },
        ],
        stack: [
          "Django",
          "React",
          "SQL Server",
          "Python",
          "scikit-learn",
          "GitLab CI",
          "BPMN",
          "UML",
        ],
        kStack: ["Python", "GitLab"],
      },
      {
        co: "AI-Inside",
        coNote: "Private",
        when: "Juil 2025 — Sep 2025",
        duration: "2 mois",
        where: "Remote · Kénitra, Maroc",
        role: "Ingénieur Machine Learning",
        focus: "Vision industrielle",
        lede: (
          <>
            Entraînement de{" "}
            <strong>
              modèles YOLOv8 pour la détection automatique de défauts
            </strong>{" "}
            en contrôle qualité industriel — avec la plateforme bout-en-bout qui
            motorise leur workflow annotation → déploiement.
          </>
        ),
        bullets: [
          <>
            Développement de <b>QC Management System</b> — plateforme intégrée
            d'annotation, d'entraînement et de suivi (Docker · React · Flask ·
            PostgreSQL · MinIO).
          </>,
          <>
            Rationalisation du workflow de préparation des données via une{" "}
            <b>application d'annotation sur mesure</b>, alignée sur les
            conventions de labellisation de l'équipe.
          </>,
          <>
            Optimisation des détecteurs YOLOv8 sur images de production ;
            augmentation et post-traitement.
          </>,
        ],
        metrics: [
          { v: "Sur mesure", l: "Outillage d'annotation" },
          { v: "YOLOv8", l: "Détection de défauts en prod" },
        ],
        stack: ["YOLOv8", "Docker", "Flask", "React", "PostgreSQL", "MinIO"],
        kStack: ["YOLOv8", "Docker"],
      },
      {
        co: "JESA",
        coNote: "Joint-Venture OCP × Worley",
        when: "Juil 2024 — Sep 2024",
        duration: "2 mois",
        where: "Casablanca, Maroc",
        role: "Ingénieur Automatisation & Analyse Processus",
        focus: "Automatisation d'ingénierie",
        lede: (
          <>
            Automatisation en Python du{" "}
            <strong>dimensionnement de réservoirs (norme API 650)</strong>,
            fiabilisant les livrables et réduisant le temps de calcul.
          </>
        ),
        bullets: [
          <>
            Modélisation et automatisation des{" "}
            <b>flux de calcul entre équipes</b> — civil, électrique, procédés —
            pour réduire les itérations.
          </>,
          <>
            Fiabilisation des livrables : validation des entrées, hypothèses
            tracées, formules testées.
          </>,
        ],
        metrics: [
          { v: "API 650", l: "Dimensionnement automatisé" },
          { v: "3", l: "Disciplines coordonnées" },
        ],
        stack: ["Python", "Ingénierie", "Modélisation procédés"],
        kStack: ["Python"],
      },
    ],

    projects: [
      {
        feat: true,
        num: "01",
        kind: "Projet d'infrastructure personnel · en cours",
        award: "En cours",
        link: "qtodash.tech",
        image: "/projects/qtodash.png",
        title: (
          <>
            Qto<span className="it">Dash</span> — tableaux de bord IA pilotés à
            la voix.
          </>
        ),
        body: "Plateforme analytique voice‑first qui transforme une question parlée en tableau de bord instantané. Une première version texte est en ligne sur app.qtodash.tech pendant que je monte l'architecture cible : auto‑hébergée de bout en bout sur un cluster de 5 VMs — 1 nœud GitLab CI/CD, 1 reverse proxy NGINX et un cluster Kubernetes à 3 nœuds qui orchestre l'API, le worker ASR et le rendu des dashboards.",
        infra: [
          { k: "GitLab", v: "CI/CD · registry · IaC" },
          { k: "Reverse proxy", v: "NGINX · TLS · routage" },
          { k: "Kubernetes", v: "cluster 3 nœuds · HPA · ingress" },
        ],
        tags: [
          "Kubernetes",
          "GitLab CI",
          "Docker",
          "NGINX",
          "Terraform",
          "Prometheus",
          "Grafana",
          "Python",
          "React",
        ],
        ph: "qtodash.tech · topologie K8s",
      },
      {
        feat: true,
        num: "02",
        kind: "Backend engineering · Sawti (plateforme de données ASR)",
        link: "sawti.dev",
        image: "/projects/sawti.png",
        title: (
          <>
            Sawti — corpus vocal participatif en{" "}
            <span className="it">Darija</span>.
          </>
        ),
        body: "Ingénieur backend sur une plateforme participative de collecte de données vocales en darija marocaine pour la recherche ASR. Conception et livraison de l'API Flask et du schéma PostgreSQL alimentant les flux de contribution voix et textes à travers plusieurs régions.",
        infra: [
          { k: "Volume", v: "465 enregistrements · 619 textes" },
          { k: "Couverture", v: "1,6h enregistrée · 3 régions" },
          { k: "Stack", v: "React · Flask · PostgreSQL" },
        ],
        tags: ["React", "Flask", "PostgreSQL", "ASR", "Collecte de données"],
        ph: "sawti.dev · carte des contributeurs",
      },
      {
        num: "03",
        kind: "ENSAM × SIANA (ONCF/SNCF) · projet d'équipe · chef de projet",
        award: "1ʳᵉ place",
        image: "/projects/robot.jpg",
        title: (
          <>
            Robot d'<span className="it">inspection</span> intelligente.
          </>
        ),
        body: "Projet d'équipe (chef de projet + membre) — prototype autonome détectant les défauts en temps réel par YOLOv8 embarqué sur Raspberry Pi. Conception mécanique, électrique et embarquée portée collectivement par l'équipe.",
        tags: [
          "YOLOv8",
          "Raspberry Pi",
          "SolidWorks",
          "Fusion 360",
          "AutoCAD Electrical",
        ],
        ph: "robot · photo terrain",
      },
      {
        num: "04",
        kind: "Académique · ENSAM Meknès · projet d'équipe",
        title: (
          <>
            Maintenance <span className="it">prédictive</span> Turbo-Fan.
          </>
        ),
        body: "Estimation du RUL sur le jeu C-MAPSS multi-capteurs de la NASA ; feature engineering sur séries temporelles et comparaison ML classique vs baselines LSTM.",
        tags: ["Séries temp.", "PyTorch", "Feature eng."],
        ph: "courbes capteurs",
      },
      {
        num: "05",
        kind: "Pipeline de vision industrielle · ENSAM",
        image: "/projects/segma.png",
        title: (
          <>
            SegmaVision<span className="it">Pro</span>.
          </>
        ),
        body: "Pipeline de segmentation guidée par le langage (Grounding DINO) servi sur NVIDIA Triton avec post-traitement batché pour maintenir une latence d'inférence basse.",
        tags: ["Grounding DINO", "NVIDIA Triton", "OpenCV"],
        ph: "schéma segmentation",
      },
      {
        num: "06",
        kind: "R&D personnel · en cours",
        title: (
          <>
            Clone <span className="it">vocal</span> personnel.
          </>
        ),
        body: "Fine-tuning de Coqui XTTS-v2 sur mes propres enregistrements pour alimenter l'agent conversationnel de cette page — la couche vocale de l'interface.",
        tags: ["Coqui XTTS-v2", "PyTorch", "Python", "TTS", "Clonage vocal"],
        ph: "forme d'onde · fine-tune voix",
      },
    ],

    skills: [
      {
        g: "Data Science & ML",
        items: [
          "Python",
          "scikit-learn",
          "XGBoost",
          "pandas / NumPy",
          "PyTorch",
          "MLflow",
          "Séries temporelles",
          "Maintenance prédictive",
          "Détection d'anomalies",
        ],
      },
      {
        g: "Vision industrielle",
        items: ["YOLOv8", "NVIDIA Triton", "Python", "OpenCV"],
      },
      {
        g: "Ingénierie & IoT",
        items: [
          "AutoCAD Electrical",
          "Raspberry Pi",
          "SolidWorks",
          "Fusion 360",
          "Prototypage embarqué (capteurs · intégration matérielle)",
        ],
      },
      {
        g: "Industrialisation & MLOps",
        items: [
          "Docker",
          "Kubernetes",
          "NGINX",
          "CI/CD",
          "GitLab",
          "Git",
          "Bash",
          "Linux",
          "PostgreSQL",
          "Prometheus",
          "Grafana",
        ],
      },
      {
        g: "Web / Apps",
        items: [
          "React",
          "TypeScript",
          "Django",
          "Flask",
          "SQL Server",
          "MinIO",
        ],
      },
      {
        g: "Langues",
        items: ["Arabe — natif", "Français — TCF C2", "Anglais — TOEFL C1"],
        lang: true,
      },
    ],

    awards: [
      {
        rank: "1ʳᵉ",
        label: (
          <>
            Innov'AM 25 — Forum Entreprises <em>Arts & Métiers</em>
          </>
        ),
        when: "Juin 2025",
      },
      {
        rank: "1ʳᵉ",
        label: (
          <>
            Success Spark 2025 — <em>Enactus ENSAM Meknès</em>
          </>
        ),
        when: "Juin 2025",
      },
      {
        rank: "2ᵉ",
        label: (
          <>
            NDSC · Voice Privacy Challenge — <em>EMINES</em>
          </>
        ),
        when: "Fév 2025",
      },
      {
        rank: "5ᵉ",
        label: (
          <>
            UPF Coding Challenge — <em>UPF</em>
          </>
        ),
        when: "Mai 2024",
      },
      {
        rank: "·",
        label: (
          <>
            Moroccan National Programming Contest —{" "}
            <em>1337 Khouribga, mentor</em>
          </>
        ),
        when: "2022",
      },
    ],

    education: [
      {
        when: "2020 — 2026",
        h: "Ingénieur d'État — Génie Industriel, option IA & Data Science",
        where: "ENSAM Meknès · Maroc",
      },
      {
        when: "2019 — 2020",
        h: "EIDIA — Mathématiques & Informatique (année préparatoire)",
        where: "UEMF (Université Euromed de Fès) · Maroc",
      },
      {
        when: "2018 — 2019",
        h: "Baccalauréat — Sciences Physiques",
        where: "Lycée Moulay Bouchaïb · Azemmour",
      },
    ],

    contact: {
      title: (
        <>
          Construisons <em>quelque chose.</em>
        </>
      ),
      lede: "Ouvert à un premier emploi en IA/ML et full-stack — logiciels industriels de bout en bout, du ML au produit — à partir d'août 2026.",
      rows: [
        { k: "Email", v: "j.elfirqi@gmail.com" },
        { k: "Téléphone", v: "+212 675 832 110" },
        { k: "Lieu", v: "Tanger, Maroc · ouvert à la mobilité" },
        { k: "GitHub", v: "github.com/include07" },
        { k: "LinkedIn", v: "linkedin.com/in/<handle-à-fournir>" },
      ],
    },
    footer: ["© 2026 Jalaleddin El Firqi", "Conçu & développé à Meknès"],
    a11y: { theme: "Changer le thème", lang: "Changer la langue" },
  },
};

export default C;
