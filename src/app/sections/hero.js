import BlackHole from "../ui/black-hole";

export default function Hero() {
  return (
    <section className="pf-hero" data-zone="dark">
      <div className="pf-hero__canvas">
        <BlackHole accent="#b98cf0" cool="#6fb6f0" boot />
      </div>

      <div className="pf-hero__stage">
        <div className="pf-hero__eyebrow pf-in" style={{ "--rd": "0.15s" }}>
          Développeur fullstack · Freelance
        </div>
        <div className="pf-hero__title pf-in" style={{ "--rd": "0.3s" }}>
          JACKSON
        </div>
        <div className="pf-hero__cta pf-in" style={{ "--rd": "0.5s" }}>
          <a className="pf-btn pf-btn--solid" href="#projets">
            VOIR LES PROJETS
            <span className="pf-btn__sweep" />
          </a>
          <a
            className="pf-btn pf-btn--ghost"
            href="/cv.pdf"
            download="Jackson-Anthonipillai-CV.pdf"
          >
            CV / PDF
          </a>
        </div>

        <a
          className="pf-hero__cue pf-in"
          href="#trajectoire"
          style={{ "--rd": "0.85s" }}
          aria-label="Faire défiler"
        >
          <span className="pf-hero__cue-label">Défiler</span>
          <span className="pf-hero__cue-rail">
            <i />
          </span>
        </a>
      </div>
    </section>
  );
}
