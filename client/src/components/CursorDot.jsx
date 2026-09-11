/**
 * CursorDot
 *
 * A small (8px) brand-blue dot that tracks the exact cursor position
 * with near-zero lag. Separate from the Three.js glow orb — the orb
 * trails with a lerp; this dot is pixel-precise.
 *
 * Behaviours:
 *  - Scales to 2× and switches to an outline ring on hover over any
 *    interactive element (button, a, [role="button"], input, textarea,
 *    select, label).
 *  - pointer-events: none — never blocks clicks.
 *  - Only active on pointer:fine devices (mouse). Touch/stylus devices
 *    get normal cursors. Detected once on mount via matchMedia.
 *  - prefers-reduced-motion → dot still renders (it's not scroll/motion-
 *    sickness-inducing) but scale spring uses duration:0.
 *  - Hides when cursor leaves the viewport.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

// Interactive elements that trigger the "hover" enlarged state
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';

export default function CursorDot() {
  const prefersReduced = useReducedMotion();

  // Only show on fine-pointer (mouse) devices
  const [isFinePonter, setIsFinePointer] = useState(false);
  const [visible,      setVisible]       = useState(false);
  const [hovered,      setHovered]       = useState(false);

  // Raw mouse position as MotionValues
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring config — very stiff = near-instant follow
  const springCfg = { stiffness: 800, damping: 60, mass: 0.4 };
  const dotX = useSpring(mouseX, springCfg);
  const dotY = useSpring(mouseY, springCfg);

  useEffect(() => {
    // Check pointer capability once
    const fine = window.matchMedia('(pointer: fine)').matches;
    setIsFinePointer(fine);
    if (!fine) return;

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      // Check if hovering over an interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovered(!!(el && el.closest(INTERACTIVE)));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  // mouseX/mouseY are stable MotionValues — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isFinePonter) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: dotX,
        y: dotY,
        position:      'fixed',
        top:           0,
        left:          0,
        pointerEvents: 'none',
        zIndex:        99999,
        // Offset so the dot centre aligns with the cursor tip
        translateX:    '-50%',
        translateY:    '-50%',
      }}
      animate={{
        opacity: visible ? 1 : 0,
        scale:   hovered ? 2 : 1,
        // Hovered: outline ring; idle: filled dot
        backgroundColor: hovered ? 'transparent' : '#29b6f6',
        border:          hovered ? '2px solid #29b6f6' : '2px solid transparent',
      }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 400, damping: 28, mass: 0.5 }
      }
      style={{
        x: dotX,
        y: dotY,
        position:        'fixed',
        top:             0,
        left:            0,
        width:           8,
        height:          8,
        borderRadius:    '50%',
        pointerEvents:   'none',
        zIndex:          99999,
        translateX:      '-50%',
        translateY:      '-50%',
        // will-change gives the browser a hint to composite this layer
        willChange:      'transform',
      }}
    />
  );
}
