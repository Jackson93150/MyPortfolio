"use client";

import { useCallback, useRef, useState } from "react";
import FbxHead from "../ui/fbx-head";

const PROJECTS = [
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
    name: "Dijkstra",
    desc: "Plus court chemin dans un réseau de transport en commun.",
    tech: "TypeScript · algo",
    media: "/london.png",
    type: "image",
    tag: "algo",
  },
  {
    name: "LeagueStats",
    desc: "Statistiques et historique de parties pour League of Legends.",
    tech: "React · Riot API",
    media: "/stats.png",
    type: "image",
    tag: "data",
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

  return (
    <div className="pf-pcard__media" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {project.type === "video" ? (
        <video
          ref={videoRef}
          data-parallax="0.12"
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
  const HEAD_W = 150;
  const railRef = useRef(null);
  const wrapRef = useRef(null);
  const hoverCardRef = useRef(null);
  const hideTimer = useRef(null);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false); // mount the 3D head after first hover
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [headUp, setHeadUp] = useState(false);

  const placeHead = useCallback((cardEl) => {
    const wrap = wrapRef.current;
    if (!wrap || !cardEl) return;
    const w = wrap.getBoundingClientRect();
    const c = cardEl.getBoundingClientRect();
    // centred on the card, tucked just behind its top edge
    setPos({
      left: c.left - w.left + c.width / 2 - HEAD_W / 2,
      top: c.top - w.top - 6,
    });
  }, []);

  const enterCard = (e) => {
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
    if (hoverCardRef.current) placeHead(hoverCardRef.current);
  }, [placeHead]);

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
            style={{ left: pos.left, top: pos.top }}
          >
            <FbxHead src="/idle.fbx" visible={armed} />
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
        <span className="pf-projects__count">Sept projets · sélection</span>
      </div>
    </section>
  );
}
