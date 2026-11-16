import React from 'react';
import { useThreeCanvas } from './useThreeCanvas';

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform vec2 uScale;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * uScale + 0.5;
    vec2 dir = vUv - uMouse;
    float d = length(dir);
    dir = dir / (d + 0.0001);

    float falloff = smoothstep(0.55, 0.0, d);
    float ripple = sin(d * 38.0 - uTime * 5.0) * 0.014 * uHover * falloff;
    uv += dir * ripple;

    float split = 0.012 * uHover * falloff;
    float r = texture2D(uTex, uv + dir * split).r;
    float g = texture2D(uTex, uv).g;
    float b = texture2D(uTex, uv - dir * split).b;
    vec3 colour = vec3(r, g, b);

    // idle: amber duotone; hover: melts into the real colours
    float gray = dot(colour, vec3(0.299, 0.587, 0.114));
    vec3 duo = mix(vec3(0.02), vec3(1.0, 0.78, 0.17), gray * 1.25);
    vec3 outCol = mix(duo, colour, smoothstep(0.0, 1.0, uHover * (0.35 + falloff * 1.2)));

    gl_FragColor = vec4(outCol, 1.0);
  }
`;

const DistortImage = ({ src, alt }) => {
  const ref = useThreeCanvas(({ THREE, scene, mount }) => {
    const uniforms = {
      uTex: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScale: { value: new THREE.Vector2(1, 1) },
      uHover: { value: 0 },
      uTime: { value: 0 },
    };
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment })
    );
    mesh.visible = false;
    scene.add(mesh);

    let planeAspect = 1;
    let imgAspect = 1;
    const updateScale = () => {
      if (planeAspect > imgAspect) uniforms.uScale.value.set(1, imgAspect / planeAspect);
      else uniforms.uScale.value.set(planeAspect / imgAspect, 1);
    };

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      uniforms.uTex.value = tex;
      imgAspect = tex.image.width / tex.image.height;
      updateScale();
      mesh.visible = true;
    });

    const target = new THREE.Vector2(0.5, 0.5);
    let hoverTarget = 0;
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    const onEnter = () => { hoverTarget = 1; };
    const onLeave = () => { hoverTarget = 0; };
    const host = mount.closest('.project-thumb') || mount.parentElement || mount;
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseenter', onEnter);
    host.addEventListener('mouseleave', onLeave);

    return {
      resize: (w, h) => { planeAspect = w / h; updateScale(); },
      update: (t) => {
        uniforms.uTime.value = t;
        uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.08;
        uniforms.uMouse.value.lerp(target, 0.12);
      },
      dispose: () => {
        host.removeEventListener('mousemove', onMove);
        host.removeEventListener('mouseenter', onEnter);
        host.removeEventListener('mouseleave', onLeave);
        if (uniforms.uTex.value) uniforms.uTex.value.dispose();
      },
    };
  }, { ortho: true });

  return (
    <div className="distort-wrap">
      {/* plain image underneath: shows while the texture loads or if WebGL/CORS fails */}
      <img className="distort-fallback" src={src} alt={alt} loading="lazy" />
      <div ref={ref} className="distort-canvas" />
    </div>
  );
};

export default DistortImage;
