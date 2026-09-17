import { useEffect } from 'react';
import { useMotionValue } from 'motion/react';
import { getLenis } from '../lib/lenis';

/**
 * Subscribes to the Lenis scroll stream and exposes two MotionValues
 * that update every animation frame — safe to feed into useTransform().
 *
 * These values intentionally bypass React renders (MotionValue semantics),
 * so they are not modelled in Redux.
 *
 * @returns {{ scrollY: MotionValue<number>, velocity: MotionValue<number> }}
 */
export function useLenisScroll() {
  const scrollY  = useMotionValue(0);
  const velocity = useMotionValue(0);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    const onScroll = ({ scroll, velocity: vel }) => {
      scrollY.set(scroll);
      velocity.set(vel);
    };

    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [scrollY, velocity]);

  return { scrollY, velocity };
}
