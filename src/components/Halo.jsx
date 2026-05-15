/* Halo.jsx — dual counter-rotating orbit of clickable tech icons + pixel portrait.
 *
 * Each orb now points to the project where I actually used that tech. Clicking
 * fires a chat prompt about that project (via onTechClick). When no project
 * applies (Kafka/Spark/HF placeholders), the orb falls back to the tech's
 * homepage in a new tab.
 */

const HALO_ICONS = {
  inner: [
    { slug: "kubernetes", label: "Kubernetes",  project: "QtoDash",                            href: "https://kubernetes.io/" },
    { slug: "gitlab",     label: "GitLab CI",   project: "QtoDash",                            href: "https://about.gitlab.com/" },
    { slug: "docker",     label: "Docker",      project: "QC Management System (AI-Inside)",   href: "https://www.docker.com/" },
    { slug: "nginx",      label: "NGINX",       project: "QtoDash",                            href: "https://nginx.org/" },
    { slug: "terraform",  label: "Terraform",   project: "QtoDash",                            href: "https://www.terraform.io/" },
    { slug: "prometheus", label: "Prometheus",  project: "QtoDash",                            href: "https://prometheus.io/" },
    { slug: "grafana",    label: "Grafana",     project: "QtoDash",                            href: "https://grafana.com/" },
    { slug: "linux",      label: "Linux",       project: "QtoDash",                            href: "https://www.kernel.org/" },
  ],
  outer: [
    { slug: "python",      label: "Python",       project: "SIANA",                            href: "https://www.python.org/" },
    { slug: "pytorch",     label: "PyTorch",      project: "Turbo-fan predictive maintenance", href: "https://pytorch.org/" },
    { slug: "react",       label: "React",        project: "SI-ESSIEUX (SIANA)",               href: "https://react.dev/" },
    { slug: "django",      label: "Django",       project: "SI-ESSIEUX (SIANA)",               href: "https://www.djangoproject.com/" },
    { slug: "postgresql",  label: "PostgreSQL",   project: "QC Management System (AI-Inside)", href: "https://www.postgresql.org/" },
    { slug: "apachekafka", label: "Kafka",        project: null,                               href: "https://kafka.apache.org/" },
    { slug: "apachespark", label: "Spark",        project: null,                               href: "https://spark.apache.org/" },
    { slug: "nvidia",      label: "NVIDIA",       project: "SegmaVisionPro",                   href: "https://www.nvidia.com/" },
    { slug: "opencv",      label: "OpenCV",       project: "SegmaVisionPro",                   href: "https://opencv.org/" },
    { slug: "raspberrypi", label: "Raspberry Pi", project: "Smart inspection robot",           href: "https://www.raspberrypi.com/" },
    { slug: "minio",       label: "MinIO",        project: "QC Management System (AI-Inside)", href: "https://min.io/" },
    { slug: "huggingface", label: "HF",           project: null,                               href: "https://huggingface.co/" },
  ],
};

export function PixelPortrait() {
  const SK = "#e6c2a3", HR = "#2C001E", SH = "#E95420", BG = "#FAF7F2", EY = "#2C001E", LI = "#f3d7b8";
  const grid = [
    "............",
    "...HHHHHH...",
    "..HHHHHHHH..",
    "..HSSSSSSH..",
    "..HSLSSLSH..",
    "..HSEEEESH..",
    "..HSSEESSH..",
    "..HSSSSSSH..",
    "...HSSSSH...",
    "..PPPPPPPP..",
    ".PPSHSHSPPP.",
    ".PPSSSSSSPP.",
  ];
  const map = { ".": BG, H: HR, S: SK, L: LI, E: EY, P: SH };
  const cells = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      cells.push(<rect key={y + "-" + x} x={x} y={y} width="1" height="1" fill={map[grid[y][x]] || BG} />);
    }
  }
  return (
    <svg className="pixel" viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true">
      {cells}
    </svg>
  );
}

function Orb({ ic, pos, hot, onTechClick, lang }) {
  const hasProject = !!ic.project;
  const tipText = hasProject
    ? (lang === "fr" ? `${ic.label} — utilisé sur ${ic.project}` : `${ic.label} — used on ${ic.project}`)
    : ic.label;

  if (!hasProject) {
    return (
      <a className="orb" href={ic.href} target="_blank" rel="noopener"
         style={pos}
         data-hot={hot ? "true" : "false"}>
        <img src={`https://cdn.simpleicons.org/${ic.slug}/currentColor`} alt="" aria-hidden="true" />
        <span className="tip">{tipText}</span>
      </a>
    );
  }

  return (
    <button type="button" className="orb"
            style={pos}
            data-hot={hot ? "true" : "false"}
            onClick={() => onTechClick && onTechClick(ic.project, ic.label)}>
      <img src={`https://cdn.simpleicons.org/${ic.slug}/currentColor`} alt="" aria-hidden="true" />
      <span className="tip">{tipText}</span>
    </button>
  );
}

export function Halo({ thinking, highlight, onTechClick, lang }) {
  const cx = 50, cy = 50;
  const innerR = 38;
  const outerR = 49;
  const place = (count, r, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      left: `${50 + r * Math.cos(a)}%`,
      top:  `${50 + r * Math.sin(a)}%`,
    };
  };
  return (
    <div className="halo">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <circle className="ring" cx={cx} cy={cy} r={innerR} />
        <circle className="ring" cx={cx} cy={cy} r={outerR} />
      </svg>
      <div className="orbit orbit-a" style={{ animationPlayState: thinking ? "paused" : "running" }}>
        {HALO_ICONS.inner.map((ic, i) => (
          <Orb key={ic.slug}
               ic={ic}
               pos={place(HALO_ICONS.inner.length, innerR, i)}
               hot={highlight && highlight.includes(ic.slug)}
               onTechClick={onTechClick}
               lang={lang} />
        ))}
      </div>
      <div className="orbit orbit-b" style={{ animationPlayState: thinking ? "paused" : "running" }}>
        {HALO_ICONS.outer.map((ic, i) => (
          <Orb key={ic.slug}
               ic={ic}
               pos={place(HALO_ICONS.outer.length, outerR, i)}
               hot={highlight && highlight.includes(ic.slug)}
               onTechClick={onTechClick}
               lang={lang} />
        ))}
      </div>
    </div>
  );
}
