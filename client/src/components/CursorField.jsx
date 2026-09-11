/**
 * CursorField (cursor-following glowing orb)
 *
 * A single glowing sphere whose world-space position genuinely trails
 * the cursor. The object moves, not the camera.
 *
 * How the cursor → world mapping works:
 *  - Mouse is normalised to NDC [-1, 1] on each axis.
 *  - We map NDC directly to a world position at a fixed Z depth in front
 *    of the camera.  At camera Z=8 with fov=55 the visible half-height at
 *    Z=0 is roughly 8 * tan(55°/2) ≈ 4.2 units, and half-width scales by
 *    aspect.  We multiply NDC by those extents so the orb reaches every
 *    corner of the screen.
 *  - The orb lerps toward that target every frame (factor 0.08) — fast
 *    enough to be clearly visible, slow enough to feel floaty.
 *
 * Visual treatment:
 *  - MeshStandardMaterial with emissive color + high emissiveIntensity
 *    gives a soft self-lit look without needing post-processing.
 *  - Additive-like effect achieved via transparent + low opacity + no
 *    depthWrite so the orb composites as a light source, not a solid ball.
 *  - A second, slightly larger outer sphere at very low opacity creates
 *    a glow halo.
 *
 * Performance safeguards:
 *  - DPR capped [1, 1.5]
 *  - prefers-reduced-motion → frameloop="never", orb stays centred/static
 *  - Page Visibility API → pauses RAF when tab is hidden
 *  - window mousemove passive listener, cleaned up on unmount
 *  - Geometry + material disposed on unmount
 */

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';

// ─── Lerp factor — 0.08 is snappy enough to clearly follow the cursor ────────
const LERP = 0.08;

// ─── Scene ───────────────────────────────────────────────────────────────────

function GlowOrb({ mouseRef, paused, reduced }) {
  const coreRef  = useRef(null);
  const haloRef  = useRef(null);
  const posRef   = useRef({ x: 0, y: 0 }); // smoothed position
  const { camera, size, viewport } = useThree();

  useFrame(() => {
    if (paused.current) return;
    if (reduced) return;

    const core = coreRef.current;
    const halo = haloRef.current;
    if (!core || !halo) return;

    // Convert NDC mouse to world units at Z=0 using viewport extents.
    // viewport.width/height are already in world units at Z=camera.position.z
    // adjusted for the camera's distance — three-fiber keeps these in sync.
    const targetX = mouseRef.current.x * (viewport.width  / 2);
    const targetY = mouseRef.current.y * (viewport.height / 2);

    posRef.current.x += (targetX - posRef.current.x) * LERP;
    posRef.current.y += (targetY - posRef.current.y) * LERP;

    core.position.x = posRef.current.x;
    core.position.y = posRef.current.y;
    halo.position.x = posRef.current.x;
    halo.position.y = posRef.current.y;

    // Gentle idle rotation so it never looks completely frozen
    core.rotation.y += 0.005;
    core.rotation.x += 0.003;
  });

  // Dispose on unmount
  useEffect(() => {
    const c = coreRef.current;
    const h = haloRef.current;
    return () => {
      c?.geometry?.dispose();
      c?.material?.dispose();
      h?.geometry?.dispose();
      h?.material?.dispose();
    };
  }, []);

  return (
    <>
      {/* Core orb — emissive bright blue, small refined size */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        {/*
         * radius=0.28, detail=2 — maps to roughly 40-50px screen size
         * at camera Z=8 with fov=55
         */}
        <icosahedronGeometry args={[0.28, 2]} />
        <meshStandardMaterial
          color="#29b6f6"
          emissive="#29b6f6"
          emissiveIntensity={2.2}
          transparent
          opacity={0.70}
          depthWrite={false}
          wireframe={false}
        />
      </mesh>

      {/* Outer halo — tight glow, not a large diffuse blob */}
      <mesh ref={haloRef} position={[0, 0, -0.1]}>
        <icosahedronGeometry args={[0.44, 1]} />
        <meshStandardMaterial
          color="#1a3a8f"
          emissive="#29b6f6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.10}
          depthWrite={false}
          side={2} /* THREE.DoubleSide = 2 */
        />
      </mesh>
    </>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

export default function CursorField() {
  const reduced  = useReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0 });
  const paused   = useRef(false);

  // Detected once at mount — stable for the device lifetime.
  // We use useRef (not useState) so it doesn't trigger a re-render and
  // the value is available synchronously on the first render.
  const isCoarsePointer = useRef(
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  // Window-level mouse tracking — normalised to [-1, 1]
  useEffect(() => {
    if (reduced || isCoarsePointer.current) return;
    const onMove = (e) => {
      mouseRef.current = {
        x:   (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);

  // Page Visibility API — freeze RAF when tab is hidden
  useEffect(() => {
    const onVis = () => { paused.current = document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Never render the Three.js canvas on touch/coarse-pointer devices —
  // there is no cursor to follow and the canvas wastes GPU on a frozen orb.
  if (isCoarsePointer.current) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        -1,         // behind ALL page content — never in the stacking path of clicks
        pointerEvents: 'none',     // belt-and-suspenders on the wrapper
        opacity:       0.55,
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 55 }}
        style={{ background: 'transparent', pointerEvents: 'none' }}  // explicit on the canvas element too
        frameloop={reduced ? 'never' : 'always'}
        gl={{ alpha: true }}
      >
        {/* No ambient/point lights needed — emissive material is self-lit */}
        <GlowOrb mouseRef={mouseRef} paused={paused} reduced={reduced} />
      </Canvas>
    </div>
  );
}
