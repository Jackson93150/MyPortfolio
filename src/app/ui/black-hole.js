"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ---------- lensed starfield (GPU points, no per-pixel raymarch) ---------- */
const starVert = /* glsl */ `
attribute float aSize;
attribute float aTwinkle;
uniform vec2  uHole;
uniform float uRs;
uniform float uAspect;
uniform float uTime;
uniform float uPixel;
varying float vMag;
varying float vSeed;

void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec4 clip = projectionMatrix * mv;

  vec2 ndc = clip.xy / clip.w;
  vec2 p = vec2((ndc.x - uHole.x) * uAspect, ndc.y - uHole.y);
  float r = max(length(p), 1e-4);

  float defl = (uRs * uRs / r) * 1.9;
  vec2 q = p + (p / r) * defl;
  float r2 = length(q);

  ndc = vec2(q.x / uAspect + uHole.x, q.y + uHole.y);
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  float mag = 1.0 + 2.6 * smoothstep(uRs * 2.4, uRs * 1.12, r2);
  float shadow = smoothstep(uRs * 0.99, uRs * 1.10, r2);
  vMag = mag * shadow;
  vSeed = aTwinkle;

  float tw = 0.72 + 0.28 * sin(uTime * 1.1 + aTwinkle * 42.0);
  gl_PointSize = aSize * uPixel * (1.0 + (mag - 1.0) * 0.45) * tw * (240.0 / -mv.z);
}
`;

const starFrag = /* glsl */ `
precision mediump float;
uniform vec3 uWarm;
uniform vec3 uCool;
varying float vMag;
varying float vSeed;

void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  if (r > 0.5 || vMag <= 0.01) discard;
  float core = smoothstep(0.5, 0.0, r);
  core = pow(core, 2.2);
  vec3 col = mix(uCool, uWarm, vSeed);
  gl_FragColor = vec4(col * vMag, core * min(vMag, 2.2));
}
`;

/* ---------- accretion disk ---------- */
const diskVert = /* glsl */ `
varying vec3 vPos;
void main(){
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const diskFrag = /* glsl */ `
precision highp float;
varying vec3 vPos;
uniform float uTime;
uniform float uIn;
uniform float uOut;
uniform float uDoppler;
uniform float uAlpha;
uniform vec3  uHot;
uniform vec3  uMid;
uniform vec3  uCold;

#define TAU 6.28318530718
#define ARMS 15.0

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// value noise that tiles seamlessly along x with the given period, so the
// polar unwrap (atan jumps by 2*PI) leaves no visible seam on the ring
float pnoise(vec2 p, float period){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float x0 = mod(i.x, period);
  float x1 = mod(i.x + 1.0, period);
  float a = hash(vec2(x0, i.y));
  float b = hash(vec2(x1, i.y));
  float c = hash(vec2(x0, i.y + 1.0));
  float d = hash(vec2(x1, i.y + 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main(){
  float r = length(vPos.xy);
  float a = atan(vPos.y, vPos.x);
  float t = clamp((r - uIn) / (uOut - uIn), 0.0, 1.0);

  float w = uTime * 1.15 / pow(r, 1.5);
  // angular coord in "arm-cell" units, continuous across the atan seam
  vec2 sp = vec2(a / TAU * ARMS + w * 3.2, log(r) * 3.4);
  float fil = pnoise(sp * 2.0,  ARMS * 2.0)  * 0.6
            + pnoise(sp * 5.0,  ARMS * 5.0)  * 0.28
            + pnoise(sp * 11.0, ARMS * 11.0) * 0.12;
  fil = 0.55 + fil * 0.9;

  float temp = pow(1.0 - t, 2.1);
  vec3 col = mix(uCold, uMid, smoothstep(0.0, 0.55, 1.0 - t));
  col = mix(col, uHot, smoothstep(0.55, 1.0, 1.0 - t));

  float dop = 1.0 + uDoppler * sin(a);
  dop = pow(max(dop, 0.16), 1.75);

  float edge = smoothstep(0.0, 0.11, t) * (1.0 - smoothstep(0.30, 0.82, t));
  float glow = temp * 1.75 + 0.07;
  float alpha = edge * fil * glow * dop * uAlpha;

  gl_FragColor = vec4(col * (0.5 + glow * 0.62) * dop, clamp(alpha, 0.0, 0.92));
}
`;

const nebulaTexture = () => {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d");
  const h = S / 2;
  const g = x.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0, "rgba(255,255,255,0.5)");
  g.addColorStop(0.35, "rgba(255,255,255,0.16)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export default function BlackHole({
  accent = "#b98cf0",
  cool = "#6fb6f0",
  className,
  starsOnly = false,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    let disposed = false;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accentC = new THREE.Color(accent);
    // `cool` kept for API parity with the design component
    void cool;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    const PIXEL = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(PIXEL);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.setClearColor(0x06060d, 1);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
    camera.position.set(0, 0.72, 15.4);

    const HOLE_Y = 1.28;
    const group = new THREE.Group();
    group.position.y = HOLE_Y;
    group.rotation.x = -0.1;
    if (!starsOnly) scene.add(group);

    /* --- starfield --- */
    const SC = 5200;
    const sPos = new Float32Array(SC * 3);
    const sSize = new Float32Array(SC);
    const sTw = new Float32Array(SC);
    for (let i = 0; i < SC; i++) {
      const v = new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(120 + Math.random() * 90);
      if (v.z > 40) v.z = -v.z;
      sPos[i * 3] = v.x;
      sPos[i * 3 + 1] = v.y + HOLE_Y;
      sPos[i * 3 + 2] = v.z;
      const b = Math.pow(Math.random(), 3.4);
      sSize[i] = 0.55 + b * 3.1;
      sTw[i] = Math.random();
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(sSize, 1));
    starGeo.setAttribute("aTwinkle", new THREE.BufferAttribute(sTw, 1));
    const starMat = new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: starFrag,
      uniforms: {
        uHole: { value: new THREE.Vector2(0, 0) },
        uRs: { value: 0.07 },
        uAspect: { value: 1 },
        uTime: { value: 0 },
        uPixel: { value: PIXEL },
        uWarm: { value: new THREE.Color(0xfff2e4) },
        uCool: { value: new THREE.Color(0xbcc6ef) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    stars.frustumCulled = false;
    stars.renderOrder = -5;
    scene.add(stars);
    // no hole to bend light around in "stars only" mode
    if (starsOnly) starMat.uniforms.uRs.value = 0.006;

    /* --- drifting nebulae --- */
    const nebTex = nebulaTexture();
    const nebs = [
      { c: 0x6a3fb0, s: 46, p: [-22, 14, -90], sp: 0.021 },
      { c: 0x2f5f9e, s: 38, p: [26, -8, -105], sp: 0.016 },
      { c: 0x8a54c8, s: 30, p: [8, 22, -120], sp: 0.012 },
    ].map((n) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(n.s, n.s),
        new THREE.MeshBasicMaterial({
          map: nebTex,
          color: n.c,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      m.position.set(...n.p);
      m.renderOrder = -6;
      m.userData = n;
      scene.add(m);
      return m;
    });

    /* --- event horizon --- */
    const R = 0.98;
    group.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R, 64, 48),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      )
    );

    const photon = new THREE.Mesh(
      new THREE.TorusGeometry(1.045, 0.007, 8, 288),
      new THREE.MeshBasicMaterial({
        color: 0xfff4e6,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    photon.renderOrder = 3;
    group.add(photon);

    const photonGlow = new THREE.Mesh(
      new THREE.TorusGeometry(1.06, 0.09, 8, 288),
      new THREE.MeshBasicMaterial({
        color: accentC,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    photonGlow.renderOrder = 3;
    group.add(photonGlow);

    /* --- disk --- */
    const mkDisk = (alpha, doppler) =>
      new THREE.ShaderMaterial({
        vertexShader: diskVert,
        fragmentShader: diskFrag,
        uniforms: {
          uTime: { value: 0 },
          uIn: { value: 1.35 },
          uOut: { value: 4.8 },
          uDoppler: { value: doppler },
          uAlpha: { value: alpha },
          uHot: { value: new THREE.Color(0xfff6ec) },
          uMid: { value: new THREE.Color(0xc79bf7) },
          uCold: { value: new THREE.Color(0x4a2d96) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

    const diskMat = mkDisk(0.88, 0.72);
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(1.28, 4.9, 240, 24),
      diskMat
    );
    disk.rotation.x = -Math.PI / 2 + 0.4;
    disk.renderOrder = 2;
    group.add(disk);

    const haloMat = mkDisk(0.5, 0.3);
    haloMat.uniforms.uIn.value = 1.1;
    haloMat.uniforms.uOut.value = 1.92;
    haloMat.uniforms.uHot.value = new THREE.Color(0xfff8ef);
    haloMat.uniforms.uMid.value = new THREE.Color(0xf0dcff);
    haloMat.uniforms.uCold.value = new THREE.Color(0xb98cf0);
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(1.08, 1.95, 224, 10),
      haloMat
    );
    halo.rotation.x = 0.07;
    halo.renderOrder = 1;
    group.add(halo);

    /* --- infalling dust --- */
    const COUNT = 1600;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const rad = new Float32Array(COUNT);
    const ang = new Float32Array(COUNT);
    const hgt = new Float32Array(COUNT);
    const hot = new THREE.Color(0xfff2e2);
    for (let i = 0; i < COUNT; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      rad[i] = 1.4 + Math.pow(Math.random(), 0.5) * 3.4;
      hgt[i] = (Math.random() - 0.5) * 0.05 * rad[i];
      const c = Math.random() < 0.3 ? hot : accentC;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        size: 0.026,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    dust.rotation.x = 0.4;
    dust.renderOrder = 2;
    group.add(dust);

    /* --- the black hole is the ONLY light: one point light sitting low, on the
       figure's own depth plane, so it rakes UP from the hole — the head and
       shoulders stay in shadow, only the chest / chin / hands catch it --- */
    const FIG_Z = -5;
    // faint lift so the shadow side is not dead black
    scene.add(new THREE.AmbientLight(0x140b1c, 0.55));
    // warm key + violet fill, both radiating outward from the hole
    const keyLight = new THREE.DirectionalLight(0xffd9b4, 2.0);
    keyLight.position.set(0.8, HOLE_Y + 0.6, 3.2);
    keyLight.target.position.set(0, HOLE_Y, -4.2);
    scene.add(keyLight);
    scene.add(keyLight.target);
    const rimLight = new THREE.DirectionalLight(accentC.clone(), 2.2);
    rimLight.position.set(-0.6, HOLE_Y - 0.3, 1.4);
    rimLight.target.position.set(0, HOLE_Y, -4.2);
    scene.add(rimLight);
    scene.add(rimLight.target);
    // a soft point glow sitting in the accretion disk itself
    const diskGlow = new THREE.PointLight(0xffe7cf, 18, 26, 2);
    diskGlow.position.set(0, HOLE_Y, 0.1);
    scene.add(diskGlow);

    let figure = null;
    let figureBaseY = 0;
    let mixer = null;
    if (!starsOnly)
      import("three/addons/loaders/FBXLoader.js")
      .then(({ FBXLoader }) => {
        if (disposed) return;
        new FBXLoader().load(
          "/male-dynamic-pose.fbx",
          (obj) => {
            if (disposed) return;
            // keep the model's own materials / embedded textures,
            // just tame them so the hole light does the sculpting
            obj.traverse((o) => {
              if (!o.isMesh) return;
              o.castShadow = false;
              o.receiveShadow = false;
              o.frustumCulled = false;
              const mats = Array.isArray(o.material) ? o.material : [o.material];
              mats.forEach((m) => {
                if (!m) return;
                if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
                if (m.color) m.color.multiplyScalar(0.92);
                if (m.emissive) m.emissive.multiplyScalar(0.15);
                if ("shininess" in m) m.shininess = 6;
                if ("metalness" in m) m.metalness = Math.min(m.metalness, 0.1);
                if ("roughness" in m) m.roughness = Math.max(m.roughness, 0.7);
                m.needsUpdate = true;
              });
            });

            // measure the bind-pose extent first (before any skinning pose)
            obj.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(obj);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const targetH = 6.3;
            const s = targetH / (size.y || 1);
            obj.scale.setScalar(s);
            figureBaseY = HOLE_Y - (center.y - size.y * 0.5) * s - 4.15;
            obj.position.set(-center.x * s, figureBaseY, FIG_Z);
            obj.rotation.y = 0.1;

            // then play the FBX's own motion once and hold the final pose
            let clip = null;
            if (obj.animations && obj.animations.length) {
              clip = obj.animations[0];
              mixer = new THREE.AnimationMixer(obj);
              const action = mixer.clipAction(clip);
              action.setLoop(THREE.LoopOnce);
              action.clampWhenFinished = true;
              action.play();
            }
            obj.renderOrder = 0;
            figure = obj;
            scene.add(figure);
          },
          undefined,
          (err) => console.warn("[black-hole] FBX load failed:", err)
        );
      })
      .catch((e) => console.warn("[black-hole] FBXLoader import failed:", e));

    /* --- sizing --- */
    let lw = 0;
    let lh = 0;
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h || (w === lw && h === lh)) return;
      lw = w;
      lh = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      starMat.uniforms.uAspect.value = w / h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    io.observe(host);

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 0.26;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 0.12;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const attr = dustGeo.getAttribute("position");
    const holeWorld = new THREE.Vector3();
    const edgeWorld = new THREE.Vector3();
    const t0 = performance.now();
    let last = t0;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      resize();

      const now = performance.now();
      const t = (now - t0) / 1000;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      mx += (tx - mx) * 0.035;
      my += (ty - my) * 0.035;

      diskMat.uniforms.uTime.value = t;
      haloMat.uniforms.uTime.value = t * 0.85;
      starMat.uniforms.uTime.value = t;

      if (!reduce) {
        camera.position.x = Math.sin(t * 0.06) * 0.34;
        camera.position.y = 0.72 + Math.sin(t * 0.045) * 0.16;
        camera.lookAt(0, HOLE_Y, 0);

        stars.rotation.z = t * 0.012;
        stars.rotation.y = t * 0.006;
        for (const n of nebs) {
          n.rotation.z = t * n.userData.sp * 0.6;
          n.position.x = n.userData.p[0] + Math.sin(t * n.userData.sp) * 6.5;
          n.position.y =
            n.userData.p[1] + Math.cos(t * n.userData.sp * 0.8) * 4.5;
        }

        if (!starsOnly) {
          photonGlow.material.opacity = 0.12 + Math.sin(t * 1.1) * 0.03;

          for (let i = 0; i < COUNT; i++) {
            ang[i] += (0.42 / Math.pow(rad[i], 1.5)) * dt * 1.6;
            rad[i] -= (0.13 / Math.sqrt(rad[i])) * dt;
            if (rad[i] < 1.32) {
              rad[i] = 3.6 + Math.random() * 1.2;
              ang[i] = Math.random() * Math.PI * 2;
            }
            attr.setXYZ(
              i,
              Math.cos(ang[i]) * rad[i],
              hgt[i] * (rad[i] / 5),
              Math.sin(ang[i]) * rad[i]
            );
          }
          attr.needsUpdate = true;
        }
      } else {
        camera.lookAt(0, HOLE_Y, 0);
      }

      group.rotation.y = mx;
      group.rotation.x = -0.1 + my;

      if (mixer) mixer.update(dt);
      if (figure) {
        figure.rotation.y = 0.1 + mx * 0.26;
        figure.position.y = figureBaseY + Math.sin(t * 0.28) * 0.1;
      }
      diskGlow.intensity = 16 + Math.sin(t * 1.1) * 3.5;

      if (!starsOnly) {
        holeWorld.set(0, HOLE_Y, 0).project(camera);
        edgeWorld.set(R, HOLE_Y, 0).project(camera);
        starMat.uniforms.uHole.value.set(holeWorld.x, holeWorld.y);
        starMat.uniforms.uRs.value = Math.max(
          Math.abs(edgeWorld.x - holeWorld.x) * (lw / lh),
          0.02
        );
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (mixer) mixer.stopAllAction();
      renderer.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [accent, cool, starsOnly]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
