"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Small looping FBX character viewer on a transparent background.
 * Keeps the model's embedded textures, plays its animation clip on repeat.
 */
export default function FbxFigure({
  src,
  className,
  height = 3.4,
  tilt = 0.18,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    // same rig as the hero-header figure: faint violet ambient + warm key
    // + violet fill + a soft warm point glow, all radiating from the front
    scene.add(new THREE.AmbientLight(0x140b1c, 0.55));
    const aim = new THREE.Vector3(0, height * 0.46, 0);
    const key = new THREE.DirectionalLight(0xffd9b4, 3.0);
    key.position.set(height * 0.14, height * 0.62, height * 1.35);
    key.target.position.copy(aim);
    scene.add(key);
    scene.add(key.target);
    const rim = new THREE.DirectionalLight(0xb98cf0, 2.2);
    rim.position.set(-height * 0.2, height * 0.28, height * 1.0);
    rim.target.position.copy(aim);
    scene.add(rim);
    scene.add(rim.target);
    const glow = new THREE.PointLight(0xffe7cf, 18, 26, 2);
    glow.position.set(0, height * 0.5, height * 1.4);
    scene.add(glow);

    let mixer = null;
    let model = null;
    let baseRotY = 0;

    import("three/addons/loaders/FBXLoader.js")
      .then(({ FBXLoader }) => {
        if (disposed) return;
        new FBXLoader().load(
          src,
          (obj) => {
            if (disposed) return;
            obj.traverse((o) => {
              if (!o.isMesh) return;
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

            if (obj.animations && obj.animations.length) {
              mixer = new THREE.AnimationMixer(obj);
              mixer.clipAction(obj.animations[0]).play(); // loops by default
              mixer.update(0);
            }

            // scale to `height`, then plant the feet at y = 0 and centre on x/z
            obj.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(obj);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const s = height / (size.y || 1);
            obj.scale.setScalar(s);
            obj.position.set(-center.x * s, -box.min.y * s, -center.z * s);
            baseRotY = 0;
            model = obj;
            scene.add(model);

            // frame the standing figure: eye near mid-height, pulled back to fit
            camera.position.set(0, height * 0.52, height * 2.15);
            camera.lookAt(0, height * 0.46, 0);
          },
          undefined,
          (err) => console.warn("[fbx-figure] load failed:", src, err)
        );
      })
      .catch((e) => console.warn("[fbx-figure] import failed:", e));

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
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { rootMargin: "150px" }
    );
    io.observe(host);

    const t0 = performance.now();
    let last = t0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      resize();
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = (now - t0) / 1000;
      if (mixer) mixer.update(dt);
      if (model) model.rotation.y = baseRotY + Math.sin(t * 0.5) * tilt;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
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
  }, [src, height, tilt]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
