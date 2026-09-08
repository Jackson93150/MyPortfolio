"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll-linked (scrubbed) scenes. Everything here reads the smoothed Lenis
 * position because SmoothScroll drives ScrollTrigger.update.
 *
 * These use GSAP's `transform` (x/y/scale); the reveal system in
 * scroll-reveal.js deliberately uses the standalone `translate`/`scale`
 * properties instead, so the two never fight over the same declaration.
 */
export default function ScrollScenes() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ---- hero: the stage lifts away, the starfield keeps drifting ---- */
      const hero = document.querySelector(".pf-hero");
      if (hero) {
        gsap.to(".pf-hero__stage", {
          y: -110,
          scale: 0.94,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        gsap.to(".pf-hero__canvas", {
          y: 120,
          scale: 1.16,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }

      /* ---- trajectoire: the arc wipes itself in, once, when it arrives ----
         A clip rect rather than stroke dashes: these paths use
         non-scaling-stroke inside a viewBox squashed by preserveAspectRatio
         ="none", which makes dash lengths unreliable. And it plays once
         instead of scrubbing, so the arc is never caught half-drawn when the
         reader stops on the section. */
      const wipe = document.querySelector(".pf-track__wipe");
      const arc = document.querySelector(".pf-track__arc");
      if (wipe && arc) {
        gsap.from(wipe, {
          attr: { width: 0 },
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: { trigger: arc, start: "top 85%", once: true },
        });
      }

      /* ---- generic depth: [data-parallax="0.2"] drifts against the page ---- */
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { yPercent: amount * 100 * -0.5 },
          {
            yPercent: amount * 100 * 0.5,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
          }
        );
      });

      /* ---- section titles drift a touch slower than the page ---- */
      gsap.utils.toArray(".pf-title-drift").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 18 },
          {
            y: -18,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
          }
        );
      });
    });

    // fonts and the FBX/three canvases change layout height after mount
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 600);
    window.addEventListener("load", refresh);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return null;
}
