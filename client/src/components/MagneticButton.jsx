/**
 * MagneticButton
 *
 * Wraps any children with a magnetic hover effect: on mouse move within
 * a detection radius (button rect + padding), the wrapper translates
 * slightly toward the cursor. On mouse leave, springs back to origin.
 *
 * Props:
 *   children      — the button/element to wrap
 *   padding       — px beyond the element boundary where magnetism activates (default 50)
 *   maxOffset     — max px translation in any direction (default 9)
 *   className     — forwarded to the wrapper div
 *   disabled      — disables the effect (useful on touch / reduced-motion)
 *
 * Implementation notes:
 *  - useSpring with moderate stiffness gives the "settle" feel.
 *  - We track position relative to the element centre, so the pull
 *    is always proportional to cursor distance from centre.
 *  - pointer-events stay on the wrapper so click events still bubble.
 *  - prefers-reduced-motion: the effect runs but spring duration is set
 *    to near-instant (still uses spring to avoid layout thrash).
 */
import { useRef, useCallback } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';

export default function MagneticButton({
  children,
  padding    = 50,
  maxOffset  = 9,
  className  = '',
  disabled   = false,
}) {
  const ref          = useRef(null);
  const prefersReduced = useReducedMotion();

  // On touch/coarse-pointer devices the magnetic effect is meaningless
  // (no hover state). Detect once and skip all motion setup.
  const isCoarsePointer = useRef(
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  const springCfg = prefersReduced
    ? { stiffness: 9999, damping: 100 }  // instant snap when motion reduced
    : { stiffness: 220, damping: 18, mass: 0.6 };

  const x = useSpring(0, springCfg);
  const y = useSpring(0, springCfg);

  const onMouseMove = useCallback((e) => {
    if (disabled || isCoarsePointer.current || !ref.current) return;
    const rect   = ref.current.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = e.clientX - cx;
    const dy     = e.clientY - cy;

    // Only pull within the detection radius
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.max(rect.width, rect.height) / 2 + padding;
    if (dist > radius) { x.set(0); y.set(0); return; }

    // Scale pull strength: closer to centre = stronger pull toward cursor
    const strength = 1 - dist / radius;
    x.set(dx * strength * (maxOffset / (rect.width / 2)));
    y.set(dy * strength * (maxOffset / (rect.height / 2)));
  }, [disabled, padding, maxOffset, x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
