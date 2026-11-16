import React from 'react';
import { useThreeCanvas } from './useThreeCanvas';

const ACCENT = 0xffc72c;
const WHITE = 0xffffff;

/* About / Projects: scroll-driven wireframe solid with a point cloud */
export const KnotScene = ({ variant = 'knot' }) => {
  const ref = useThreeCanvas(({ THREE, scene }) => {
    const geo = variant === 'dodeca'
      ? new THREE.DodecahedronGeometry(2.3, 0)
      : new THREE.TorusKnotGeometry(1.7, 0.5, 180, 24);

    const group = new THREE.Group();
    group.add(new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.55 })
    ));
    group.add(new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: WHITE, size: 0.035, transparent: true, opacity: 0.9 })
    ));
    if (variant === 'dodeca') {
      group.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.1, 0)),
        new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity: 0.25 })
      ));
    }
    scene.add(group);

    return {
      update: (t, mouse, scroll) => {
        group.rotation.y = t * 0.25 + scroll * 6;
        group.rotation.x = t * 0.12 + mouse.y * 0.6 + scroll * 3;
        group.rotation.z = mouse.x * 0.3;
        group.position.y = Math.sin(t * 0.8) * 0.25;
        const s = 0.9 + Math.sin(scroll * Math.PI) * 0.25;
        group.scale.setScalar(s);
      },
    };
  });

  return <div ref={ref} className="three-fill" />;
};

/* Contact: live particle wave field that rises under the cursor */
export const WaveGrid = () => {
  const ref = useThreeCanvas(({ THREE, scene, camera }) => {
    camera.position.set(0, 4.2, 10);
    camera.lookAt(0, 0, 0);

    const cols = 100;
    const rows = 56;
    const gap = 0.32;
    const count = cols * rows;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const k = (i * rows + j) * 3;
        pos[k] = (i - cols / 2) * gap;
        pos[k + 2] = (j - rows / 2) * gap;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    scene.add(new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.95 })
    ));

    const accent = new THREE.Color(ACCENT);
    const grey = new THREE.Color(0x3a3a3a);
    const tmp = new THREE.Color();

    return {
      update: (t, mouse) => {
        const mx = mouse.x * 14;
        for (let i = 0; i < count; i++) {
          const x = pos[i * 3];
          const zz = pos[i * 3 + 2];
          const bump = Math.exp(-((x - mx) ** 2) / 8) * 1.4;
          const y = Math.sin(x * 0.55 + t * 1.2) * 0.45 + Math.cos(zz * 0.6 + t * 0.9) * 0.45 + bump * (0.6 + Math.sin(t * 2) * 0.2);
          pos[i * 3 + 1] = y;
          tmp.copy(grey).lerp(accent, Math.min(1, Math.max(0, (y + 0.6) / 2.2)));
          col[i * 3] = tmp.r;
          col[i * 3 + 1] = tmp.g;
          col[i * 3 + 2] = tmp.b;
        }
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
      },
    };
  }, { fov: 55, z: 10 });

  return <div ref={ref} className="three-fill" />;
};

/* Hero: a breathing particle globe ringed by orbiting dots; follows the pointer and swells on scroll */
export const HeroGlobe = () => {
  const ref = useThreeCanvas(({ THREE, scene }) => {
    const group = new THREE.Group();
    scene.add(group);

    /* sphere of points on a Fibonacci lattice */
    const N = 2200;
    const R = 2.15;
    const base = new Float32Array(N * 3);
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      base[i * 3] = Math.cos(th) * r;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = Math.sin(th) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.95 })));

    /* tilted orbit rings, each with a dot riding it */
    const rings = [];
    [[2.9, 1.2, 0.2], [3.25, -0.5, 0.9]].forEach(([radius, tx, tz], k) => {
      const pts = [];
      for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)); }
      const holder = new THREE.Group();
      holder.rotation.set(tx, 0, tz);
      holder.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity: 0.22 })));
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshBasicMaterial({ color: k === 0 ? ACCENT : WHITE }));
      holder.add(dot);
      group.add(holder);
      rings.push({ holder, dot, radius, speed: k === 0 ? 0.7 : -0.5 });
    });

    const accent = new THREE.Color(ACCENT);
    const white = new THREE.Color(WHITE);
    const grey = new THREE.Color(0x4a4a4e);
    const tmp = new THREE.Color();

    return {
      update: (t, mouse, scroll) => {
        for (let i = 0; i < N; i++) {
          const bx = base[i * 3];
          const by = base[i * 3 + 1];
          const bz = base[i * 3 + 2];
          const wave = Math.sin(t * 1.4 + bx * 3.2 + by * 2.4) * 0.5 + Math.cos(t * 1.1 + bz * 3.0) * 0.5;
          const rr = R + wave * 0.16;
          pos[i * 3] = bx * rr;
          pos[i * 3 + 1] = by * rr;
          pos[i * 3 + 2] = bz * rr;
          const k = (wave + 1) / 2;
          tmp.copy(grey).lerp(white, k);
          if (k > 0.86) tmp.lerp(accent, (k - 0.86) / 0.14);
          col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
        }
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;

        group.rotation.y = t * 0.18 + mouse.x * 0.7 + scroll * 4;
        group.rotation.x = mouse.y * 0.5 + scroll * 1.2;
        group.scale.setScalar(1 + scroll * 0.35);
        rings.forEach((r, i) => {
          const a = t * r.speed + i * 2;
          r.dot.position.set(Math.cos(a) * r.radius, 0, Math.sin(a) * r.radius);
          r.holder.rotation.y = t * 0.1 * (i ? -1 : 1);
        });
      },
    };
  }, { fov: 45, z: 9.5 });

  return <div ref={ref} className="three-fill" />;
};
