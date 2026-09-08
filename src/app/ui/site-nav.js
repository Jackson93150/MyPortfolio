"use client";

import { useEffect, useRef, useState } from "react";

const NAV = [
  ["Projets", "#projets"],
  ["Trajectoire", "#trajectoire"],
  ["Stack", "#stack"],
  ["Contact", "#contact"],
];

const PROBE = 46; // the y the nav "reads" to know what it is sitting on

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [zone, setZone] = useState("dark");
  const [active, setActive] = useState("");
  const barRef = useRef(null);
  const frame = useRef(0);

  useEffect(() => {
    const zones = () => Array.from(document.querySelectorAll("[data-zone]"));
    const targets = () =>
      NAV.map(([, href]) => document.querySelector(href)).filter(Boolean);

    const read = () => {
      frame.current = 0;
      const y = window.scrollY || window.pageYOffset;

      setScrolled(y > 40);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      // whatever sits under the bar decides the nav's colour scheme
      const under = zones().find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= PROBE && r.bottom > PROBE;
      });
      if (under) setZone(under.dataset.zone === "dark" ? "dark" : "light");

      // the section owning the middle of the viewport is the active link
      const mid = window.innerHeight * 0.42;
      let current = "";
      targets().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) current = `#${el.id}`;
      });
      setActive(current);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // freeze the page behind the mobile sheet (Lenis owns the scroll when active)
  useEffect(() => {
    const lenis = window.__lenis;
    if (open) lenis ? lenis.stop() : (document.body.style.overflow = "hidden");
    else lenis ? lenis.start() : (document.body.style.overflow = "");
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className="pf-nav"
        data-zone={zone}
        data-scrolled={scrolled ? "true" : "false"}
        data-open={open ? "true" : "false"}
      >
        <a className="pf-nav__brand" href="#top">
          Jackson · Portfolio
        </a>

        <div className="pf-nav__links">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={active === href ? "is-active" : ""}
            >
              {label}
            </a>
          ))}
        </div>

        <button
          className="pf-nav__burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <span className="pf-nav__progress">
          <i ref={barRef} />
        </span>
      </nav>

      <div className="pf-nav__sheet" data-open={open ? "true" : "false"}>
        {NAV.map(([label, href], i) => (
          <a
            key={href}
            href={href}
            style={{ "--i": i }}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
