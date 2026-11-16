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
