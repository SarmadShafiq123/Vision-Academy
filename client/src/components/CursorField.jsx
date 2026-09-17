import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';

const LERP_FACTOR             = 0.08;
const ORB_CAMERA_Z            = 8;
const ORB_CAMERA_FOV          = 55;
const ORB_CANVAS_OPACITY      = 0.55;
const ORB_Z_INDEX             = -1;
const MAX_DEVICE_PIXEL_RATIO  = 1.5;
const MIN_DEVICE_PIXEL_RATIO  = 1;
const ORB_CORE_RADIUS         = 0.28;
const ORB_CORE_DETAIL         = 2;
const ORB_CORE_EMISSIVE_INT   = 2.2;
const ORB_CORE_OPACITY        = 0.70;
const ORB_HALO_RADIUS         = 0.44;
const ORB_HALO_DETAIL         = 1;
const ORB_HALO_EMISSIVE_INT   = 0.8;
const ORB_HALO_OPACITY        = 0.10;
const ORB_HALO_Z_OFFSET       = -0.1;
const ORB_IDLE_ROT_Y          = 0.005;
const ORB_IDLE_ROT_X          = 0.003;
const THREE_DOUBLE_SIDE       = 2;

function isCoarsePointerDevice() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

function GlowOrb({ mouseRef, paused, reduced }) {
  const coreRef = useRef(null);
  const haloRef = useRef(null);
  const posRef  = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useFrame(() => {
    if (paused.current || reduced) return;
    const core = coreRef.current;
    const halo = haloRef.current;
    if (!core || !halo) return;

    const targetX = mouseRef.current.x * (viewport.width  / 2);
    const targetY = mouseRef.current.y * (viewport.height / 2);

    posRef.current.x += (targetX - posRef.current.x) * LERP_FACTOR;
    posRef.current.y += (targetY - posRef.current.y) * LERP_FACTOR;

    core.position.x = posRef.current.x;
    core.position.y = posRef.current.y;
    halo.position.x = posRef.current.x;
    halo.position.y = posRef.current.y;

    core.rotation.y += ORB_IDLE_ROT_Y;
    core.rotation.x += ORB_IDLE_ROT_X;
  });

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
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[ORB_CORE_RADIUS, ORB_CORE_DETAIL]} />
        <meshStandardMaterial
          color="#29b6f6"
          emissive="#29b6f6"
          emissiveIntensity={ORB_CORE_EMISSIVE_INT}
          transparent
          opacity={ORB_CORE_OPACITY}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={haloRef} position={[0, 0, ORB_HALO_Z_OFFSET]}>
        <icosahedronGeometry args={[ORB_HALO_RADIUS, ORB_HALO_DETAIL]} />
        <meshStandardMaterial
          color="#1a3a8f"
          emissive="#29b6f6"
          emissiveIntensity={ORB_HALO_EMISSIVE_INT}
          transparent
          opacity={ORB_HALO_OPACITY}
          depthWrite={false}
          side={THREE_DOUBLE_SIDE}
        />
      </mesh>
    </>
  );
}

export default function CursorField() {
  const reduced  = useReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0 });
  const paused   = useRef(false);

  const skipRender = useRef(isCoarsePointerDevice());

  useEffect(() => {
    if (reduced || skipRender.current) return;
    const onMove = (e) => {
      mouseRef.current = {
        x:   (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);

  useEffect(() => {
    const onVis = () => { paused.current = document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (skipRender.current) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        ORB_Z_INDEX,
        pointerEvents: 'none',
        opacity:       ORB_CANVAS_OPACITY,
      }}
    >
      <Canvas
        dpr={[MIN_DEVICE_PIXEL_RATIO, MAX_DEVICE_PIXEL_RATIO]}
        camera={{ position: [0, 0, ORB_CAMERA_Z], fov: ORB_CAMERA_FOV }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
        frameloop={reduced ? 'never' : 'always'}
        gl={{ alpha: true }}
      >
        <GlowOrb mouseRef={mouseRef} paused={paused} reduced={reduced} />
      </Canvas>
    </div>
  );
}
