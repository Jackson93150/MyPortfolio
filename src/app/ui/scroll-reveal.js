"use client";

import { useEffect } from "react";

/**
 * One observer for the whole page.
 *
 * Markup opts in with attributes so the sections stay server components:
 *   data-reveal="up|fade|left|right|scale|blur"  → the element itself animates
 *   data-stagger                                 → its direct children cascade
 *   data-count                                   → number rolls up to its value
 *
 * Everything animates through `translate` / `scale` / `opacity`, never
 * `transform`, so hover lifts on cards keep working during and after the reveal.
 */
export default function ScrollReveal() {
  useEffect(() => {
    // normally already set by the pre-paint script in layout.js
    document.documentElement.setAttribute("data-fx", "on");

    const nodes = Array.from(
      document.querySelectorAll("[data-reveal], [data-stagger], [data-count]")
    );

    // number every staggered child so CSS can offset its delay
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty("--i", String(i));
      });
    });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const countUp = (el) => {
      const raw = (el.textContent || "").trim();
      const target = Number.parseFloat(raw);
      if (!Number.isFinite(target)) return; // "TS", "FR / EN"… left alone
      const suffix = raw.replace(/^[\d.,\s]+/, "");
      const start = performance.now();
      const dur = 900;
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = raw;
      };
      el.textContent = "0" + suffix;
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-in");
          if (el.hasAttribute("data-count")) countUp(el);
          io.unobserve(el);
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0 }
    );

    nodes.forEach((el) => io.observe(el));

    // anything already above the fold on load shows straight away
    requestAnimationFrame(() => {
      nodes.forEach((el) => {
        if (el.classList.contains("is-in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
          el.classList.add("is-in");
          if (el.hasAttribute("data-count")) countUp(el);
          io.unobserve(el);
        }
      });
    });

    return () => io.disconnect();
  }, []);

  return null;
}
