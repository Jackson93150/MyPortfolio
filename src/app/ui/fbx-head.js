"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Tiny looping FBX viewer framed tight on the head only, transparent bg,
 * lit with the same rig as the hero figure. `visible` gates rendering.
 */
export default function FbxHead({ src, visible = true, accent = "#b98cf0" }) {
  const mountRef = useRef(null);
  const visRef = useRef(visible);
  visRef.current = visible;

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
    const camera = new THREE.PerspectiveCamera(28, 1, 0.01, 100);
    const accentC = new THREE.Color(accent);

    // same rig as the hero-header figure
    scene.add(new THREE.AmbientLight(0x140b1c, 0.55));
    const aim = new THREE.Vector3(0, 0.1, 0);
    const key = new THREE.DirectionalLight(0xffd9b4, 2.4);
    key.position.set(0.6, 1.0, 2.4);
    key.target.position.copy(aim);
    scene.add(key, key.target);
    const rim = new THREE.DirectionalLight(accentC.clone(), 2.4);
    rim.position.set(-0.7, -0.2, 1.6);
    rim.target.position.copy(aim);
    scene.add(rim, rim.target);
    const glow = new THREE.PointLight(0xffe7cf, 9, 12, 2);
    glow.position.set(0, 0.2, 1.6);
    scene.add(glow);

    let mixer = null;
    let model = null;

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
              mixer.clipAction(obj.animations[0]).play();
              mixer.update(0);
            }
            obj.updateMatrixWorld(true);

            // frame tight on the head bone
            const headBone = obj.getObjectByName("mixamorig:Head");
            const topBone = obj.getObjectByName("mixamorig:HeadTop_End");
            const hp = new THREE.Vector3();
            const tp = new THREE.Vector3();
            let headSize = 1;
            if (headBone) {
              headBone.getWorldPosition(hp);
              if (topBone) {
                topBone.getWorldPosition(tp);
                headSize = Math.max(hp.distanceTo(tp) * 1.9, 1e-3);
              } else {
                headSize = 12; // rough Mixamo head span if no crown bone
              }
            } else {
              const box = new THREE.Box3().setFromObject(obj);
              box.getCenter(hp);
              headSize = box.getSize(new THREE.Vector3()).y;
            }

            const target = 1.0; // head ~1 world unit tall after scaling
            const s = target / headSize;
            obj.scale.setScalar(s);
            obj.updateMatrixWorld(true);
            if (headBone) headBone.getWorldPosition(hp);
            else hp.multiplyScalar(s);
            // origin roughly at the middle of the face (head bone is near the jaw)
            obj.position.set(-hp.x, -hp.y - 0.16, -hp.z);
            model = obj;
            scene.add(model);

            // frame the head with margin so it never clips when it turns
            camera.position.set(0, 0.04, 2.45);
            camera.lookAt(0, 0.04, 0);
          },
          undefined,
          (err) => console.warn("[fbx-head] load failed:", src, err)
        );
      })
      .catch((e) => console.warn("[fbx-head] import failed:", e));

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

    const t0 = performance.now();
    let last = t0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visRef.current) return;
      resize();
      const t = (now - t0) / 1000;
      if (mixer) mixer.update(dt);
      if (model) model.rotation.y = Math.sin(t * 0.5) * 0.16;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
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
  }, [src, accent]);

  return <div ref={mountRef} aria-hidden="true" style={{ width: "100%", height: "100%" }} />;
}
