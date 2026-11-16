import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Shared Three.js boilerplate: renderer, resize, mouse, visibility pause, cleanup.
 * setup({ THREE, scene, camera, renderer, mount }) -> { update(t, mouse, scroll), resize(w, h), dispose() }
 */
export function useThreeCanvas(setup, { fov = 45, z = 8, ortho = false, maxPixelRatio = 1.5, fps = 60 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const mount = ref.current;
    if (!mount) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = ortho
      ? new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10)
      : new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
    if (!ortho) camera.position.z = z;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const api = setup({ THREE, scene, camera, renderer, mount }) || {};

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      if (camera.isPerspectiveCamera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      if (api.resize) api.resize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf;
    const frame = () => {
      const rect = mount.getBoundingClientRect();
      const scroll = Math.min(1, Math.max(0, 1 - rect.bottom / (window.innerHeight + rect.height)));
      if (api.update) api.update(clock.getElapsedTime(), mouse, scroll);
      renderer.render(scene, camera);
    };
    const minGap = 1000 / fps - 2;
    let lastDraw = 0;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible || now - lastDraw < minGap) return;
      lastDraw = now;
      frame();
    };
    if (reduceMotion) frame();
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
      io.disconnect();
      if (api.dispose) api.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
