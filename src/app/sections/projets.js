"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FbxHead from "../ui/fbx-head";

const PROJECTS = [
  {
    name: "Jarvis",
    desc: "Assistant personnel vocal : agents connectés à Gmail, Discord, Strava et à la santé, mémoire longue et LLM local.",
    tech: "SwiftUI · FastAPI · LLM · Docker",
    media: "/jarvis.mp4",
    type: "video",
    fit: "portrait",
    tag: "ia · mobile",
  },
  {
    name: "Lootopia",
    desc: "Chasse au trésor multijoueur, classement temps réel et éléments 3D interactifs.",
    tech: "React · NestJS · WebSocket · Three.js",
    media: "/lootopia.mp4",
    type: "video",
    tag: "web · jeu",
  },
  {
    name: "Instamint",
    desc: "Place de marché NFT : créer, acheter et vendre des NFT en pair à pair.",
    tech: "Next.js · Solidity · ethers",
    media: "/instamint.mp4",
    type: "video",
    tag: "web3",
  },
  {
    name: "RetroRunner",
    desc: "Jeu de plateforme : niveaux, sprite sheets et animations, en JS Canvas.",
    tech: "JavaScript · Canvas",
    media: "/retrorunner.mp4",
    type: "video",
    tag: "jeu · canvas",
  },
  {
    name: "BabyGrow",
    desc: "Application de suivi et de gestion de la santé d'un bébé.",
    tech: "React Native · NestJS",
    media: "/babygrow.png",
    type: "image",
    tag: "app",
  },
  {
    name: "Portfolio",
    desc: "Ce portfolio interactif : animations et 3D temps réel.",
    tech: "Next.js · Three.js",
    media: "/portfolio.png",
    type: "image",
    tag: "web",
  },
];

function CardMedia({ project, index }) {
  const videoRef = useRef(null);
  const onEnter = () => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const portrait = project.fit === "portrait";

  return (
    <div
      className={`pf-pcard__media${portrait ? " pf-pcard__media--portrait" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {project.type === "video" ? (
        <video
          ref={videoRef}
          data-parallax={portrait ? undefined : "0.12"}
          src={`${project.media}#t=0.1`}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.media}
          alt={project.name}
          loading="lazy"
          data-parallax="0.12"
        />
      )}
      <span className="pf-pcard__idx">/{String(index + 1).padStart(2, "0")}</span>
      <span className="pf-pcard__role">{project.tag}</span>
    </div>
  );
}

export default function Projets() {
  const railRef = useRef(null);
  const wrapRef = useRef(null);
  const hoverCardRef = useRef(null);
  const hideTimer = useRef(null);
  const touchRef = useRef(false); // no hover to drive the head on a phone
  const [touch, setTouch] = useState(false);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false); // mount the 3D head on demand
  const [inView, setInView] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [headUp, setHeadUp] = useState(false);

  const placeHead = useCallback((cardEl) => {
    const wrap = wrapRef.current;
    if (!wrap || !cardEl) return;
    const w = wrap.getBoundingClientRect();
    const c = cardEl.getBoundingClientRect();
    // the card's centre; CSS pulls the head back by half its own width
    setPos({
      left: c.left - w.left + c.width / 2,
      top: c.top - w.top - 6,
    });
  }, []);

  // the card sitting closest to the middle of the rail — what a touch user is
  // "pointing at" as they swipe
  const centredCard = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return null;
    const r = rail.getBoundingClientRect();
    const mid = r.left + r.width / 2;
    let best = null;
    let bestD = Infinity;
    for (const card of rail.children) {
      const c = card.getBoundingClientRect();
      const d = Math.abs(c.left + c.width / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = card;
      }
    }
    return best;
  }, []);

  const followCentred = useCallback(() => {
    const card = centredCard();
    if (!card) return;
    hoverCardRef.current = card;
    placeHead(card);
  }, [centredCard, placeHead]);

  const enterCard = (e) => {
    if (touchRef.current) return; // a tap must not hijack the scroll-driven head
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    hoverCardRef.current = e.currentTarget;
    placeHead(e.currentTarget);
    if (!armed) {
      setArmed(true);
      // mount at rest, then rise a tick later so the first one animates too
      setTimeout(() => setHeadUp(true), 30);
    } else {
      setHeadUp(true);
    }
  };
  const leaveCard = () => {
    if (touchRef.current) return;
    hoverCardRef.current = null;
    // small delay so crossing the gap between two cards doesn't make it dip
    hideTimer.current = setTimeout(() => {
      setHeadUp(false);
      hideTimer.current = null;
    }, 150);
  };

  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // map scroll progress (0 → 1) onto the dots so the last one lights up
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 4 ? el.scrollLeft / max : 0;
    setActive(Math.round(p * (PROJECTS.length - 1)));
    if (touchRef.current) followCentred();
    else if (hoverCardRef.current) placeHead(hoverCardRef.current);
  }, [followCentred, placeHead]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const coarse = window.matchMedia("(hover: none)").matches;
    touchRef.current = coarse;
    setTouch(coarse);

    // only render the WebGL head while the carousel is actually on screen
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!coarse || !entry.isIntersecting) return;
        // on touch the head just rides along with the centred card
        followCentred();
        setArmed(true);
        setHeadUp(true);
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(wrap);

    const onResize = () => {
      if (touchRef.current) followCentred();
      else if (hoverCardRef.current) placeHead(hoverCardRef.current);
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [followCentred, placeHead]);

  return (
    <section id="projets" className="pf-section pf-projects" data-zone="light">
      <div className="pf-projects__head" data-reveal="up">
        <div>
          <div className="pf-projects__eyebrow">Journal de bord</div>
          <h2 className="pf-title-drift">PROJETS</h2>
        </div>
        <span className="pf-projects__hint">Glisser →</span>
      </div>

      <div className="pf-projects__railwrap" ref={wrapRef}>
        <span className="pf-projects__fade pf-projects__fade--l" />
        <span className="pf-projects__fade pf-projects__fade--r" />
        <div
          className="pf-projects__rail"
          ref={railRef}
          onScroll={onScroll}
          data-stagger
          style={{ "--stagger": "90ms" }}
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.name}
              className="pf-pcard"
              onMouseEnter={enterCard}
              onMouseLeave={leaveCard}
            >
              <CardMedia project={p} index={i} />
              <div className="pf-pcard__head">
                <span className="pf-pcard__name">{p.name}</span>
              </div>
              <p className="pf-pcard__desc">{p.desc}</p>
              <div className="pf-pcard__tags">
                {p.tech.split(" · ").map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="pf-pcard__foot">
                <span>{p.tech.split(" · ").slice(0, 2).join(" · ")}</span>
                <span className="pf-pcard__arrow">↗</span>
              </div>
            </article>
          ))}
        </div>

        {armed && (
          <div
            className="pf-projects__head3d"
            data-on={headUp ? "true" : "false"}
            data-touch={touch ? "true" : "false"}
            style={{ left: pos.left, top: pos.top }}
          >
            <FbxHead src="/idle.fbx" visible={armed && inView} />
          </div>
        )}
      </div>

      {/* paper sinks back into the black of the contact section */}
      <div className="pf-seam pf-seam--to-dark" aria-hidden="true" />

      <div className="pf-projects__foot" data-reveal="fade">
        <div className="pf-projects__dots">
          {PROJECTS.map((p, i) => (
            <span key={p.name} className={i === active ? "is-active" : ""} />
          ))}
        </div>
        <span className="pf-projects__count">Six projets · sélection</span>
      </div>
    </section>
  );
}
