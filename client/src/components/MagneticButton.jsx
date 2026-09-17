import { useRef, useCallback } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';

const DEFAULT_PADDING    = 50;
const DEFAULT_MAX_OFFSET = 9;
const SPRING_STIFFNESS   = 220;
const SPRING_DAMPING     = 18;
const SPRING_MASS        = 0.6;
const INSTANT_STIFFNESS  = 9999;
const INSTANT_DAMPING    = 100;

function isCoarsePointerDevice() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

export default function MagneticButton({
  children,
  padding   = DEFAULT_PADDING,
  maxOffset = DEFAULT_MAX_OFFSET,
  className = '',
  disabled  = false,
}) {
  const ref              = useRef(null);
  const prefersReduced   = useReducedMotion();
  const isCoarsePointer  = useRef(isCoarsePointerDevice());

  const springCfg = prefersReduced
    ? { stiffness: INSTANT_STIFFNESS, damping: INSTANT_DAMPING }
    : { stiffness: SPRING_STIFFNESS,  damping: SPRING_DAMPING, mass: SPRING_MASS };

  const x = useSpring(0, springCfg);
  const y = useSpring(0, springCfg);

  const onMouseMove = useCallback((e) => {
    if (disabled || isCoarsePointer.current || !ref.current) return;
    const rect     = ref.current.getBoundingClientRect();
    const cx       = rect.left + rect.width  / 2;
    const cy       = rect.top  + rect.height / 2;
    const dx       = e.clientX - cx;
    const dy       = e.clientY - cy;
    const dist     = Math.sqrt(dx * dx + dy * dy);
    const radius   = Math.max(rect.width, rect.height) / 2 + padding;
    if (dist > radius) { x.set(0); y.set(0); return; }
    const strength = 1 - dist / radius;
    x.set(dx * strength * (maxOffset / (rect.width  / 2)));
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
