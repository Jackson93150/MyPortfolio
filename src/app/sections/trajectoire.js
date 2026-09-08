import FbxFigure from "../ui/fbx-figure";

const NODES = [
  {
    year: "2019",
    tag: "Licence",
    text: "J'entre en licence informatique à Paris 8.",
  },
  {
    year: "2022",
    tag: "Avicenne",
    text: "Je rejoins Avicenne Studio et je commence mon master en alternance.",
  },
  {
    year: "2024",
    tag: "Master",
    text: "J'obtiens mon master à SupDeVinci.",
  },
  {
    year: "2025",
    tag: "Freelance",
    text: "Je me lance en freelance",
  },
];

/* bead centres — % across the arc box, % down it (arc rises left→right) */
const BEADS = [
  { left: "12.5%", top: "73%", kind: "blue", delay: "0s" },
  { left: "37.5%", top: "62%", kind: "blue", delay: ".7s" },
  { left: "62.5%", top: "46%", kind: "violet", delay: "1.4s" },
  { left: "87.5%", top: "26%", kind: "planet", delay: "0s" },
];

const ARC_PATH =
  "M40 150 C 340 142, 520 120, 640 104 C 820 80, 980 52, 1160 38";

export default function Trajectoire() {
  return (
    <section id="trajectoire" className="pf-section pf-section--tight">
      <div className="pf-section__head" data-reveal="up">
        <h2 className="pf-title-drift">TRAJECTOIRE</h2>
        <span className="pf-section__meta">Le parcours · 2019 → présent</span>
      </div>

      <div className="pf-track">
        <div className="pf-track__arc" data-reveal="fade">
          <svg
            className="pf-track__svg"
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="tj-arc" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#6fb6f0" />
                <stop offset="46%" stopColor="#a67ce8" />
                <stop offset="100%" stopColor="#6b3fa0" />
              </linearGradient>
              <filter id="tj-glow" x="-20%" y="-60%" width="140%" height="220%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="b" />
                </feMerge>
              </filter>
              <clipPath id="tj-wipe" clipPathUnits="userSpaceOnUse">
                {/* full width by default: with no JS the arc simply shows */}
                <rect className="pf-track__wipe" x="0" y="-80" width="1200" height="360" />
              </clipPath>
            </defs>

            <g clipPath="url(#tj-wipe)">
              <path
                className="pf-track__line"
                d={ARC_PATH}
                fill="none"
                stroke="url(#tj-arc)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.28"
                filter="url(#tj-glow)"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="pf-track__line"
                d={ARC_PATH}
                fill="none"
                stroke="url(#tj-arc)"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.7"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="pf-track__comet"
                d={ARC_PATH}
                pathLength="1"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="0.03 0.97"
                strokeDashoffset="1"
                filter="url(#tj-glow)"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>

          {BEADS.map((b, i) => (
            <span
              key={i}
              className={`pf-bead pf-bead--${b.kind}`}
              data-reveal="pop"
              style={{
                left: b.left,
                top: b.top,
                animationDelay: b.delay,
                "--rd": `${0.3 + i * 0.36}s`,
              }}
            >
              <span className="pf-bead__halo" style={{ animationDelay: b.delay }} />
              <span className="pf-bead__drop" />
            </span>
          ))}

          {/* little looping 3D figure standing on the "Présent · Freelance" point */}
          <div
            className="pf-track__figure"
            style={{ left: BEADS[3].left, top: BEADS[3].top }}
          >
            <FbxFigure src="/offensive-idle.fbx" />
          </div>
        </div>

        <div className="pf-track__row" data-stagger style={{ "--stagger": "110ms" }}>
          {NODES.map((n) => (
            <div key={n.year} className="pf-tnode">
              <div className="pf-tnode__head">
                <span className="pf-tnode__year">{n.year}</span>
                <span className="pf-tnode__tag">{n.tag}</span>
              </div>
              <div className="pf-tnode__text">{n.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
