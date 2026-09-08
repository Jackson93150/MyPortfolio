const CARDS = [
  {
    n: "01",
    title: "TYPESCRIPT",
    rows: [
      { label: "Next.js · React", time: "4 ans", pct: 100 },
      { label: "NestJS", time: "4 ans", pct: 100 },
      { label: "Vue.js", time: "3 ans", pct: 75 },
    ],
    note: "Apps web, apps natives, APIs. Le typage coupe les mauvaises surprises avant la prod.",
  },
  {
    n: "02",
    title: "DONNÉES & API",
    rows: [
      { label: "PostgreSQL", time: "4 ans", pct: 100 },
      { label: "Python", time: "3 ans", pct: 75 },
      { label: "GraphQL", time: "2 ans", pct: 50 },
    ],
    note: "Modèle propre, requêtes rapides, APIs qui tiennent la charge.",
  },
  {
    n: "03",
    title: "PLATEFORME & CLOUD",
    rows: [
      { label: "Docker", time: "4 ans", pct: 100 },
      { label: "Cloud", time: "3 ans", pct: 80 },
      { label: "CI · déploiement", time: "3 ans", pct: 75 },
    ],
    note: "Conteneurs, cloud, pipelines. Une mise en prod prévisible, à chaque fois.",
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
