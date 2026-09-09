"use client";

import { useEffect, useRef, useState } from "react";
import { finishBoot, onBoot } from "./boot";

const MIN_MS = 700; // long enough to read, short enough not to annoy
const MAX_MS = 12000; // never trap a visitor behind a failed download

export default function BootScreen() {
  const [shown, setShown] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const barRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();

    // re-arm: React's dev double-invoke runs the cleanup below before this
    root.removeAttribute("data-booted");

    // the page must not scroll underneath the overlay
    window.__lenis?.stop();

    let target = 0;
    let shownValue = 0;
    let raf = 0;
    let assetsDone = false;
    let fontsDone = false;
    let finished = false;

    const unsub = onBoot((p, done) => {
      target = p;
      if (done) assetsDone = true;
    });

    document.fonts?.ready.then(() => {
      fontsDone = true;
    });
    if (!document.fonts) fontsDone = true;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      // land on a clean 100 rather than whatever frame the easing stopped on
      if (barRef.current) barRef.current.style.transform = "scaleX(1)";
      if (pctRef.current) pctRef.current.textContent = "100";
      root.setAttribute("data-booted", "on"); // releases the hero intro
      window.__lenis?.start();
      // scrolling was frozen, so land at the top — unless a #hash asked otherwise
      if (!window.location.hash) window.scrollTo(0, 0);
      setLeaving(true);
      window.setTimeout(() => setShown(false), reduced ? 0 : 700);
    };

    // the bar eases toward the real figure so it never stutters
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const elapsed = performance.now() - started;

      // creep forward slowly while waiting, so a slow network still feels alive
      const creep = Math.min(0.9, elapsed / 9000);
      const goal = Math.max(target, creep);
      shownValue += (goal - shownValue) * 0.09;

      const ready = assetsDone && fontsDone && elapsed > MIN_MS;
      if (ready) shownValue += (1 - shownValue) * 0.25;

      if (barRef.current) barRef.current.style.transform = `scaleX(${shownValue})`;
      if (pctRef.current)
        pctRef.current.textContent = String(Math.round(shownValue * 100)).padStart(2, "0");

      if (ready && shownValue > 0.995) finish();
      else if (elapsed > MAX_MS) finish();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      root.setAttribute("data-booted", "on");
      window.__lenis?.start();
    };
  }, []);

  // a visitor with JS off never sees this at all — see the [data-fx] gate in CSS
  useEffect(() => {
    // if the hero scene never mounts (no WebGL at all), don't wait on it
    const t = window.setTimeout(finishBoot, MAX_MS - 500);
    return () => window.clearTimeout(t);
  }, []);

  if (!shown) return null;

  return (
    <div className="pf-boot" data-leaving={leaving ? "true" : "false"} role="status">
      <div className="pf-boot__inner">
        <div className="pf-boot__brand">JACKSON</div>
        <div className="pf-boot__meta">
          <span>Chargement de la scène</span>
          <span className="pf-boot__pct">
            <i ref={pctRef}>00</i>%
          </span>
        </div>
        <span className="pf-boot__track">
          <i ref={barRef} />
        </span>
      </div>
    </div>
  );
}
