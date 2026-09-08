import BlackHole from "../ui/black-hole";

const LINKS = [
  {
    k: "LinkedIn",
    v: "jackson-anthonipillai",
    href: "https://www.linkedin.com/in/jackson-anthonipillai-20a88a227/",
  },
  { k: "GitHub", v: "@Jackson93150", href: "https://github.com/Jackson93150" },
  {
    k: "Curriculum",
    v: "CV · PDF",
    href: "/cv.pdf",
    download: "Jackson-Anthonipillai-CV.pdf",
  },
];

export default function Contact() {
  return (
    <footer id="contact" className="pf-contact" data-zone="dark">
      <div className="pf-contact__bg" data-parallax="0.18">
        <BlackHole starsOnly accent="#b98cf0" cool="#6fb6f0" />
      </div>

      <div className="pf-contact__grid">
        <div className="pf-contact__left" data-reveal="left">
          <div className="pf-contact__pill">
            <span className="pf-contact__dot" />
            Disponible pour missions
          </div>
          <h2 className="pf-contact__title">ON DÉCOLLE ?</h2>
          <p className="pf-contact__lead">
            Vous avez un projet à faire avancer. Écrivez-moi, je vous
            réponds sous 24&nbsp;h.
          </p>
          <div className="pf-contact__stats" data-reveal="up" style={{ "--rd": "0.15s" }}>
            <div>
              <div className="pf-contact__stat-v">24 h</div>
              <div className="pf-contact__stat-l">délai de réponse</div>
            </div>
            <span className="pf-contact__sep" />
            <div>
              <div className="pf-contact__stat-v">Paris</div>
              <div className="pf-contact__stat-l">et remote</div>
            </div>
            <span className="pf-contact__sep" />
            <div>
              <div className="pf-contact__stat-v pf-contact__stat-v--accent">
                FR / EN
              </div>
              <div className="pf-contact__stat-l">langues</div>
            </div>
          </div>
        </div>

        <div className="pf-contact__links" data-stagger style={{ "--stagger": "110ms" }}>
          <a
            className="pf-contact__mail"
            href="mailto:anthonipillaijackson@gmail.com"
          >
            M&apos;ÉCRIRE
            <small>anthonipillaijackson@gmail.com</small>
            <span className="pf-btn__sweep" />
          </a>
          {LINKS.map((l) => (
            <a
              key={l.k}
              className="pf-contact__row"
              href={l.href}
              {...(l.download
                ? { download: l.download }
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <span className="pf-contact__row-k">{l.k}</span>
              <span className="pf-contact__row-v">
                {l.v}
                <span>↗</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="pf-contact__foot" data-reveal="fade">
        <span>Jackson · développeur fullstack</span>
        <span>Paris · 48.85 N · 2.35 E</span>
        <span className="pf-contact__foot-accent">MMXXVI</span>
      </div>
    </footer>
  );
}
