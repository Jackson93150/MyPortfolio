import Hero from "./sections/hero";
import Trajectoire from "./sections/trajectoire";
import Stack from "./sections/stack";
import Projets from "./sections/projets";
import Contact from "./sections/contact";

export default function Home() {
  return (
    <div className="pf-wrap" id="top">
      <Hero />

      <div className="pf-duo" data-zone="light">
        {/* the hero's black carries over and dissolves into the paper here,
            so the dark screens themselves stay dark edge to edge */}
        <div className="pf-seam pf-seam--from-dark" aria-hidden="true" />
        <Trajectoire />
        <div className="pf-rule" data-reveal="fade" aria-hidden="true">
          <span />
        </div>
        <Stack />
      </div>

      <div className="pf-rule pf-rule--wide" data-reveal="fade" aria-hidden="true">
        <span />
      </div>

      <Projets />
      <Contact />
    </div>
  );
}
