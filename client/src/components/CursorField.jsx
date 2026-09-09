/**
 * CursorField — persistent full-viewport 3D ambient background.
 *
 * Mounted once in App.jsx, outside the route tree, so it never remounts
 * on page navigation. Sits behind all content via z-index: -1 and never
 * intercepts pointer events (pointer-events: none).
 *
 * Effect: a spread of brand-blue particles at varying Z depths. Moving the
 * cursor shifts the CAMERA slightly (not the whole scene), which creates a
 * natural parallax illusion — particles near the camera shift more than
 * distant ones. All movement is lerped (factor 0.05) so it feels floaty.
 *
 * Performance safeguards:
 *  - DPR capped at [1, 1.5]
 *  - 200 particles max — sufficient for visual richness, light on the GPU
 *  - prefers-reduced-motion → frameloop="never", camera stays still
 *  - Page Visibility API → pauses RAF when the tab is hidden
 *  - window mousemove listener is passive and cleaned up on unmount
 *  - Every geometry and material is disposed on unmount
 */

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 200;

// How far the camera drifts in response to the cursor (world units).
// Keep small — this is a depth-parallax hint, not cursor-chasing.
const CAM_DRIFT_X = 0.8;
const CAM_DRIFT_Y = 0.5;

// Lerp factor — lower = smoother/slower, higher = snappier
const LERP = 0.05;

// ─── Scene ───────────────────────────────────────────────────────────────────

/**
 * ParticleField
 * Renders 200 point-sprites spread across a volume of roughly 20×20×16 units.
 * Depth spread (Z range ±8) is what makes the camera-shift feel 3-dimensional.
 */
function ParticleField({ paused }) {
  const ptsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20;   // x  ±10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;   // y  ±10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;   // z  ±8  ← depth spread
    }
    return arr;
  }, []);

  // Very slow self-rotation so the field never feels completely static
  useFrame((_, delta) => {
    if (!ptsRef.current || paused.current) return;
    ptsRef.current.rotation.y += delta * 0.025;
    ptsRef.current.rotation.x += delta * 0.010;
  });

  useEffect(() => {
    const pts = ptsRef.current;
    return () => {
      pts?.geometry?.dispose();
      if (pts?.material) {
        Array.isArray(pts.material)
          ? pts.material.forEach((m) => m.dispose())
          : pts.material.dispose();
      }
    };
  }, []);

  return (
    <points ref={ptsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#29b6f6"
        size={0.06}
        sizeAttenuation   // near particles appear larger than far ones
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * CameraRig
 * Reads the shared mouseRef and lerps the camera toward the target offset
 * each frame. This is the core of the parallax effect — because THREE
 * perspective projection makes near objects shift more than far objects
 * when the viewpoint moves, the depth spread in ParticleField naturally
 * produces a convincing front/back parallax with zero extra math.
 */
function CameraRig({ mouseRef, paused }) {
  // smoothed camera position (lerped each frame)
  const smooth = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useFrame(() => {
    if (paused.current) return;

    smooth.current.x += (mouseRef.current.x * CAM_DRIFT_X - smooth.current.x) * LERP;
    smooth.current.y += (mouseRef.current.y * CAM_DRIFT_Y - smooth.current.y) * LERP;

    camera.position.x = smooth.current.x;
    camera.position.y = smooth.current.y;
    // Keep Z fixed — only X/Y drift for the parallax effect
    camera.lookAt(0, 0, 0);
  });

  return null; // renders nothing, only manipulates the camera
}

// ─── Root component ──────────────────────────────────────────────────────────

export default function CursorField() {
  const reduced  = useReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0 });
  const paused   = useRef(false);

  // Window-level mouse tracking — normalised to [-1, 1] on each axis
  useEffect(() => {
    if (reduced) return;

    const onMove = (e) => {
      mouseRef.current = {
        x:   (e.clientX / window.innerWidth)  * 2 - 1,
        // Y inverted: moving up gives positive Y (matches Three.js convention)
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);

  // Page Visibility API — freeze the render loop when the tab is hidden
  useEffect(() => {
    const onVisibility = () => { paused.current = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        -1,       // behind every page element
        pointerEvents: 'none',   // never blocks clicks, scrolls, or focus
        opacity:       0.25,     // subtle ambient layer
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 55 }}
        style={{ background: 'transparent' }}
        // Stop R3F's internal RAF entirely when reduced-motion is preferred
        frameloop={reduced ? 'never' : 'always'}
      >
        <ambientLight intensity={0.4} />
        <ParticleField paused={paused} />
        {/* CameraRig is only mounted when motion is allowed */}
        {!reduced && <CameraRig mouseRef={mouseRef} paused={paused} />}
      </Canvas>
    </div>
  );
}
