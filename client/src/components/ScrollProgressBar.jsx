/**
 * ScrollProgressBar
 * Thin (3px) fixed bar at the very top of the viewport that fills
 * left-to-right based on Lenis scroll progress.
 *
 * Lenis fires a `scroll` event with `{ scroll, limit, progress, ... }`.
 * We read `progress` (0–1) from that event and update a Motion spring
 * for a smooth, non-jittery fill.
 *
 * Falls back to native window scroll if Lenis isn't mounted yet.
 * z-index 9999 — above the sticky navbar (z-50 = 50).
 */
import { useEffect, useRef } from 'react';
import { useSpring, motion, useMotionValue } from 'motion/react';
import { useLenis } from '../context/LenisContext';

export default function ScrollProgressBar() {
  const lenisRef   = useLenis();
  const rawProgress = useMotionValue(0);

  // Spring smoothing removes micro-jitter from fast scrolling
  const scaleX = useSpring(rawProgress, {
    stiffness: 200,
    damping:   30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const lenis = lenisRef?.current;

    if (lenis) {
      // Lenis scroll event — `progress` is already 0–1
      const onScroll = ({ progress }) => rawProgress.set(progress);
      lenis.on('scroll', onScroll);
      return () => lenis.off('scroll', onScroll);
    }

    // Fallback: native scroll listener
    const onNativeScroll = () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      rawProgress.set(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    return () => window.removeEventListener('scroll', onNativeScroll);
  // lenisRef is a stable ref object — re-run if it changes identity
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenisRef]);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: 'left',
        position:        'fixed',
        top:             0,
        left:            0,
        right:           0,
        height:          3,
        background:      'linear-gradient(to right, #1a3a8f, #29b6f6)',
        zIndex:          9999,
      }}
    />
  );
}
