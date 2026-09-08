const CARDS = [
  {
    n: "01",
    title: "TYPESCRIPT",
    rows: [
      { label: "Next.js · React", time: "4 ans", pct: 96 },
      { label: "React Native", time: "3 ans", pct: 88 },
      { label: "NestJS", time: "3 ans", pct: 86 },
    ],
    note: "Le même langage du composant à l'API. Web et mobile depuis la même base de types.",
  },
  {
    n: "02",
    title: "DONNÉES & API",
    rows: [
      { label: "PostgreSQL", time: "4 ans", pct: 92 },
      { label: "GraphQL", time: "3 ans", pct: 78 },
      { label: "Python", time: "3 ans", pct: 72 },
    ],
    note: "Schéma, index, requêtes. L'automatisation et les traitements passent par Python.",
  },
  {
    n: "03",
    title: "PLATEFORME & 3D",
    rows: [
      { label: "Docker", time: "3 ans", pct: 82 },
      { label: "Three.js", time: "3 ans", pct: 84 },
      { label: "CI · déploiement", time: "3 ans", pct: 76 },
    ],
    note: "Environnements reproductibles, 3D temps réel, livraisons petites et fréquentes.",
  },
];

const STATS = [
  ["4", "ans en prod"],
  ["12", "technos"],
  ["TS", "langage pivot"],
];

export default function Stack() {
  return (
    <section id="stack" className="pf-section">
      <div className="pf-stack__head" data-reveal="up">
        <div>
          <div className="pf-stack__eyebrow">Équipement embarqué</div>
          <h2 className="pf-title-drift">STACK</h2>
        </div>
        <div className="pf-stack__stats">
          {STATS.map(([v, l], i) => (
            <div key={l} className="pf-stack__stat" data-last={i === STATS.length - 1}>
              <div className="pf-stack__stat-v" data-count>
                {v}
              </div>
              <div className="pf-stack__stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pf-stack__grid" data-stagger style={{ "--stagger": "130ms" }}>
        {CARDS.map((card) => (
          <article key={card.n} className="pf-scard">
            <div className="pf-scard__head">
              <span className="pf-scard__title">{card.title}</span>
              <span className="pf-scard__n">{card.n}</span>
            </div>
            <div className="pf-scard__rows">
              {card.rows.map((row, i) => (
                <div key={row.label} className="pf-srow">
                  <div className="pf-srow__top">
                    <span>{row.label}</span>
                    <span className="pf-srow__time">{row.time}</span>
                  </div>
                  <div className="pf-srow__track">
                    <div
                      className="pf-srow__fill"
                      style={{
                        width: `${row.pct}%`,
                        transitionDelay: `${0.35 + i * 0.16}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="pf-scard__note">{card.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
