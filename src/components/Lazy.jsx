import React, { Suspense, lazy } from 'react';
import './Scenes.css';

const Knot = lazy(() => import('./SectionScenes').then((m) => ({ default: m.KnotScene })));
const Wave = lazy(() => import('./SectionScenes').then((m) => ({ default: m.WaveGrid })));
const Globe = lazy(() => import('./SectionScenes').then((m) => ({ default: m.HeroGlobe })));
const Distort = lazy(() => import('./DistortImage'));

export const KnotScene = (props) => <Suspense fallback={null}><Knot {...props} /></Suspense>;
export const WaveGrid = () => <Suspense fallback={null}><Wave /></Suspense>;
export const HeroGlobe = () => <Suspense fallback={null}><Globe /></Suspense>;
export const DistortImage = ({ src, alt }) => (
  <Suspense fallback={<img className="distort-fallback" src={src} alt={alt} />}>
    <Distort src={src} alt={alt} />
  </Suspense>
);
