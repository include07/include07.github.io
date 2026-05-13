/* Halo.jsx — dual counter-rotating orbit of clickable tech icons + pixel portrait */

const HALO_ICONS = {
  inner: [
    { slug: "kubernetes", label: "Kubernetes",  href: "https://kubernetes.io/" },
    { slug: "gitlab",     label: "GitLab CI",   href: "https://about.gitlab.com/" },
    { slug: "docker",     label: "Docker",      href: "https://www.docker.com/" },
    { slug: "nginx",      label: "NGINX",       href: "https://nginx.org/" },
    { slug: "terraform",  label: "Terraform",   href: "https://www.terraform.io/" },
    { slug: "prometheus", label: "Prometheus",  href: "https://prometheus.io/" },
    { slug: "grafana",    label: "Grafana",     href: "https://grafana.com/" },
    { slug: "linux",      label: "Linux",       href: "https://www.kernel.org/" },
  ],
  outer: [
    { slug: "python",      label: "Python",       href: "https://www.python.org/" },
    { slug: "pytorch",     label: "PyTorch",      href: "https://pytorch.org/" },
    { slug: "react",       label: "React",        href: "https://react.dev/" },
    { slug: "django",      label: "Django",       href: "https://www.djangoproject.com/" },
    { slug: "postgresql",  label: "PostgreSQL",   href: "https://www.postgresql.org/" },
    { slug: "apachekafka", label: "Kafka",        href: "https://kafka.apache.org/" },
    { slug: "apachespark", label: "Spark",        href: "https://spark.apache.org/" },
    { slug: "nvidia",      label: "NVIDIA",       href: "https://www.nvidia.com/" },
    { slug: "opencv",      label: "OpenCV",       href: "https://opencv.org/" },
    { slug: "raspberrypi", label: "Raspberry Pi", href: "https://www.raspberrypi.com/" },
    { slug: "minio",       label: "MinIO",        href: "https://min.io/" },
    { slug: "huggingface", label: "HF",           href: "https://huggingface.co/" },
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

export function Halo({ thinking, highlight }) {
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
        {HALO_ICONS.inner.map((ic, i) => {
          const pos = place(HALO_ICONS.inner.length, innerR, i);
          const hot = highlight && highlight.includes(ic.slug);
          return (
            <a key={ic.slug} className="orb" href={ic.href} target="_blank" rel="noopener"
               style={{ ...pos, ...(hot ? { borderColor: "var(--accent)", background: "var(--bg)" } : {}) }}
               title={ic.label}>
              <img src={`https://cdn.simpleicons.org/${ic.slug}/currentColor`} alt="" aria-hidden="true" />
              <span className="tip">{ic.label}</span>
            </a>
          );
        })}
      </div>
      <div className="orbit orbit-b" style={{ animationPlayState: thinking ? "paused" : "running" }}>
        {HALO_ICONS.outer.map((ic, i) => {
          const pos = place(HALO_ICONS.outer.length, outerR, i);
          const hot = highlight && highlight.includes(ic.slug);
          return (
            <a key={ic.slug} className="orb" href={ic.href} target="_blank" rel="noopener"
               style={{ ...pos, ...(hot ? { borderColor: "var(--accent)", background: "var(--bg)" } : {}) }}
               title={ic.label}>
              <img src={`https://cdn.simpleicons.org/${ic.slug}/currentColor`} alt="" aria-hidden="true" />
              <span className="tip">{ic.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
