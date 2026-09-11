/**
 * useLenisScroll
 *
 * Returns two MotionValues kept in sync with the live Lenis instance:
 *   scrollY  — absolute scroll position in px (mirrors window.scrollY)
 *   velocity — Lenis scroll velocity (px/frame), springs toward 0 when idle
 *
 * Both are safe to feed directly into Motion's useTransform().
 * They update inside Lenis's own RAF loop via lenis.on('scroll'), so
 * they are always frame-accurate and never fight the native scroll event.
 *
 * Returns { scrollY, velocity } — both are MotionValue<number>.
 */
import { useEffect } from 'react';
import { useMotionValue } from 'motion/react';
import { useLenis } from '../context/LenisContext';

export function useLenisScroll() {
  const lenisRef = useLenis();
  const scrollY  = useMotionValue(0);
  const velocity = useMotionValue(0);

  useEffect(() => {
    const lenis = lenisRef?.current;
    if (!lenis) return;

    const onScroll = ({ scroll, velocity: vel }) => {
      scrollY.set(scroll);
      velocity.set(vel);
    };

    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  // lenisRef is a stable object ref — only re-run on identity change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenisRef]);

  return { scrollY, velocity };
}
