/* EditorialPortfolio.jsx — long-form editorial layout.
 * Locked to the Ubuntu typography + palette to match the Chat page;
 * only language (EN/FR) and theme (light/dark) are user-controllable. */

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import C from "../content.jsx";
import { useTweaks } from "../lib/tweaks.jsx";
import editorialCss from "../styles/editorial.css?inline";

const TWEAK_DEFAULTS = {
  lang: "en",
  dark: false,
};

function Logo({ co }) {
  const map = {
    "SIANA":     { src: "/logos/siana.png",     bg: "#ffffff", pad: "10%" },
    "AI-Inside": { src: "/logos/ai-inside.png", bg: "#ffffff", pad: "12%" },
    "JESA":      { src: "/logos/jesa.png",      bg: "#ffffff", pad: "18%" },
  };
  const m = map[co];
  if (!m) return null;
  return (
    <div style={{ width: "100%", height: "100%", background: m.bg, display: "flex",
                  alignItems: "center", justifyContent: "center", padding: m.pad, boxSizing: "border-box" }}>
      <img src={m.src} alt={co}
           style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
    </div>
  );
}

function SunIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>); }
function MoonIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>); }

const ICON_SLUGS = {
  "Kubernetes": "kubernetes",
  "GitLab CI": "gitlab",
  "GitLab": "gitlab",
  "Docker": "docker",
  "NGINX": "nginx",
  "Nginx": "nginx",
  "Terraform": "terraform",
  "Prometheus": "prometheus",
  "Grafana": "grafana",
  "Python": "python",
  "C": "c",
  "C++": "cplusplus",
  "Java": "openjdk",
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "PyTorch": "pytorch",
  "React": "react",
  "Django": "django",
  "Flask": "flask",
  "PostgreSQL": "postgresql",
  "MinIO": "minio",
  "Linux": "linux",
  "Kafka": "apachekafka",
  "Spark": "apachespark",
  "Spark / Kafka": "apachekafka",
  "Spark Streaming": "apachespark",
  "Elasticsearch": "elasticsearch",
  "Kibana": "kibana",
  "YOLOv8": "yolo",
  "OpenCV": "opencv",
  "NVIDIA Triton": "nvidia",
  "Raspberry Pi": "raspberrypi",
  "SolidWorks": "dassaultsystemes",
  "Fusion 360": "autodesk",
  "AutoCAD Electrical": "autodesk",
  "Grounding DINO": "openai",
  "NLP": "openai",
  "Transformers": "huggingface",
  "Predictive maintenance": "siemens",
  "Maintenance prédictive": "siemens",
  "Anomaly detection": "prometheus",
  "Détection d'anomalies": "prometheus",
  "Time series": "influxdb",
  "Séries temp.": "influxdb",
  "Séries temporelles": "influxdb",
  "Feature eng.": "scikitlearn",
  "MLOps": "mlflow",
  "NVIDIA": "nvidia",
};

function TechIcon({ label }) {
  const slug = ICON_SLUGS[label];
  if (!slug) return null;
  return (
    <img className="tech-ico"
         src={`https://cdn.simpleicons.org/${slug}/currentColor`}
         alt="" aria-hidden="true"
         onError={(e) => { e.currentTarget.style.display = "none"; }} />
  );
}

export default function EditorialPortfolio() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const c = C[t.lang] || C.en;

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme   = t.dark ? "dark" : "light";
    html.dataset.palette = "ubuntu";
    html.dataset.type    = "ubuntu";
    html.lang = t.lang;
    document.title = "Jalaleddin El Firqi — AI & Data Science Engineer";
    return () => {
      delete html.dataset.theme;
      delete html.dataset.palette;
      delete html.dataset.type;
    };
  }, [t.dark, t.lang]);

  return (
    <>
      <style>{editorialCss}</style>
      <header className="top">
        <div className="top-inner">
          <a href="#top" className="mark"><span className="dot"></span>{c.mark}</a>
          <nav className="nav">
            {c.nav.map((n) => <a key={n.h} href={n.h}>{n.l}</a>)}
          </nav>
          <div className="top-right">
            <Link to="/" className="mark" style={{ textDecoration: "underline", textDecorationColor: "var(--rule-soft)", textUnderlineOffset: 4 }}>
              {t.lang === "fr" ? "← Chat" : "← Chat"}
            </Link>
            <div className="seg" role="group" aria-label={c.a11y.lang}>
              <button aria-pressed={t.lang === "en"} onClick={() => setTweak("lang", "en")}>EN</button>
              <button aria-pressed={t.lang === "fr"} onClick={() => setTweak("lang", "fr")}>FR</button>
            </div>
            <button className="icon-btn" aria-label={c.a11y.theme} onClick={() => setTweak("dark", !t.dark)}>
              {t.dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="wrap" id="top">
        <section className="hero" data-screen-label="Hero">
          <div className="hero-grid">
            <div className="hero-meta">
              <div className="row-i"><span className="k">{t.lang === "fr" ? "Lieu" : "Location"}</span></div>
              <div>{c.location}</div>
              <div className="row-i" style={{ marginTop: 8 }}>
                <span className="k">{t.lang === "fr" ? "Domaine" : "Field"}</span>
              </div>
              <div>{c.role}<br/>{c.field}</div>
              <div style={{ marginTop: 14 }} className="available">{c.available}</div>
            </div>

            <div>
              <h1 className="name">
                <span>{c.name.a}</span><br/>
                <span className="it">{c.name.b}.</span>
              </h1>
              <p className="lede">{c.lede}</p>
              <div className="hero-actions">
                {c.actions.map((a, i) => (
                  <a
                    key={i}
                    className={"btn " + (a.kind === "primary" ? "primary" : "")}
                    href={a.href || "#contact"}
                    {...(a.download ? { download: a.download } : {})}
                    {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {a.label}<span className="arr">{a.arr}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="hero-side">
              {c.stats.map((s, i) => (
                <div key={i} className="stat">
                  <b>{s.v}</b>
                  <span>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="marquee" aria-hidden="true">
            <span className="marquee-track">
              {[...c.marquee, ...c.marquee].map((m, i) => (
                <span key={i}>{m}<span className="star"> ✦ </span></span>
              ))}
            </span>
          </div>
        </section>

        <section id="experience" data-screen-label="Experience">
          <div className="section-head">
            <div className="section-num"><b>·{c.sections.experience.num}</b> / {t.lang === "fr" ? "Section" : "Section"}</div>
            <h2 className="section-title">{c.sections.experience.title}</h2>
            <div className="section-meta">{c.sections.experience.meta}</div>
          </div>

          <div className="xp-list">
            {c.experiences.map((x, i) => (
              <article className="xp" key={i}>
                <div className="xp-stamp">
                  <div className="xp-logo"><Logo co={x.co} /></div>
                  <b>·0{i + 1}</b>
                  {x.focus}
                  <span className="when">{x.when}</span>
                  <span className="where">{x.duration} · {x.where}</span>
                </div>
                <div className="xp-body">
                  <h3>{x.role} <span className="at">— {x.co}</span></h3>
                  <div className="co"><b>{x.co}</b> · {x.coNote}</div>
                  <p>{x.lede}</p>
                  <ul>
                    {x.bullets.map((b, j) => <li key={j}><span>{b}</span></li>)}
                  </ul>
                </div>
                <aside className="xp-side">
                  <div className="xp-metrics">
                    {x.metrics.map((m, k) => (
                      <div key={k} className="xp-metric">
                        <b>{m.v}</b><span>{m.l}</span>
                      </div>
                    ))}
                  </div>
                  <div className="xp-stack">
                    {x.stack.map((s) => (
                      <span key={s} className={"tag" + (x.kStack.includes(s) ? " k" : "")}>
                        <TechIcon label={s} />{s}
                      </span>
                    ))}
                  </div>
                </aside>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" data-screen-label="Projects">
          <div className="section-head">
            <div className="section-num"><b>·{c.sections.projects.num}</b> / Section</div>
            <h2 className="section-title">{c.sections.projects.title}</h2>
            <div className="section-meta">{c.sections.projects.meta}</div>
          </div>

          <div className="projects-grid">
            {c.projects.map((p, i) => (
              <article key={i} className={"proj" + (p.feat ? " feat" : "")}>
                {p.award && <div className="proj-award">★ {p.award}</div>}
                {p.image && (
                  <img className="proj-image" src={p.image} alt=""
                       onError={(e) => { e.currentTarget.style.display = "none"; }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
                  <div className="proj-num"><b>·{p.num}</b> / {t.lang === "fr" ? "Projet" : "Project"}</div>
                  <h3>{p.title}</h3>
                  <div className="kind">{p.kind}</div>
                  <p>{p.body}</p>
                  <div className="proj-tags">
                    {p.tags.map((tag) => <span key={tag} className="tag"><TechIcon label={tag} />{tag}</span>)}
                  </div>
                  {p.infra && (
                    <div className="proj-infra">
                      {p.infra.map((row, k) => (
                        <div key={k} className="infra-row">
                          <TechIcon label={row.k} />
                          <b>{row.k}</b>
                          <span>{row.v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <a className="proj-cta"
                     href={p.link ? `https://${p.link}` : "#"}
                     target={p.link ? "_blank" : undefined}
                     rel={p.link ? "noopener" : undefined}>
                    {p.link ? p.link : (t.lang === "fr" ? "Étude de cas" : "Case study")}
                    <span className="arr">{p.link ? "↗" : "→"}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" data-screen-label="Skills">
          <div className="section-head">
            <div className="section-num"><b>·{c.sections.skills.num}</b> / Section</div>
            <h2 className="section-title">{c.sections.skills.title}</h2>
            <div className="section-meta">{c.sections.skills.meta}</div>
          </div>

          <div className="skills-grid">
            {c.skills.map((g, i) => (
              <div key={i} className="skill-group">
                <h4>{g.g}</h4>
                <div className="skill-list">
                  {g.items.map((s) => (
                    <span key={s} className={"skill" + (g.lang ? " lang" : "")}>
                      {!g.lang && <TechIcon label={s.split(" — ")[0]} />}{s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="awards" data-screen-label="Awards">
          <div className="section-head">
            <div className="section-num"><b>·{c.sections.awards.num}</b> / Section</div>
            <h2 className="section-title">{c.sections.awards.title}</h2>
            <div className="section-meta">{c.sections.awards.meta}</div>
          </div>

          <div className="awards-list">
            {c.awards.map((a, i) => (
              <div key={i} className="award">
                <div className="rank">{a.rank}</div>
                <div className="label">{a.label}</div>
                <div className="when">{a.when}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="education" data-screen-label="Education">
          <div className="section-head">
            <div className="section-num"><b>·{c.sections.education.num}</b> / Section</div>
            <h2 className="section-title">{c.sections.education.title}</h2>
            <div className="section-meta">{c.sections.education.meta}</div>
          </div>

          <div className="edu-grid">
            {c.education.map((e, i) => (
              <div key={i} className="edu">
                <div className="when">{e.when}</div>
                <h3>{e.h}</h3>
                <div className="where">{e.where}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact" data-screen-label="Contact">
          <div>
            <h2>{c.contact.title}</h2>
            <p style={{ maxWidth: 520, marginTop: 24, fontSize: 18, lineHeight: 1.5, color: "var(--ink-2)" }}>
              {c.contact.lede}
            </p>
            <a className="btn primary" href={`mailto:${c.contact.rows[0].v}`} style={{ marginTop: 24 }}>
              {t.lang === "fr" ? "M'écrire" : "Email me"}<span className="arr">→</span>
            </a>
          </div>
          <div className="contact-side">
            {c.contact.rows.map((r, i) => {
              const isLink =
                r.k === "Email" ||
                r.k === "Phone" || r.k === "Téléphone" ||
                r.k === "GitHub" ||
                r.k === "LinkedIn";
              const href =
                r.k === "Email" ? `mailto:${r.v}` :
                (r.k === "Phone" || r.k === "Téléphone") ? `tel:${r.v.replace(/[\s()\-]/g, "")}` :
                r.k === "GitHub" ? `https://${r.v.replace(/^https?:\/\//, "")}` :
                r.k === "LinkedIn" ? `https://${r.v.replace(/^https?:\/\//, "")}` :
                null;
              const external = r.k === "GitHub" || r.k === "LinkedIn";
              return (
                <div key={i} className="contact-row">
                  <span className="k">{r.k}</span>
                  {isLink ? (
                    <a
                      className="v"
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {r.v}
                    </a>
                  ) : (
                    <span className="v">{r.v}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <footer className="footer">
          <div>{c.footer[0]}</div>
          <div>{c.footer[1]}</div>
        </footer>
      </main>
    </>
  );
}
