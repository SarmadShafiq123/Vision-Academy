/**
 * ScrollProgressBar
 * Thin (3px) fixed bar at the very top of the viewport that fills
 * left-to-right based on scroll progress.
 * z-index 9999 — above the sticky navbar (z-50 = 50).
 * Uses Motion's useScroll + useSpring for a smooth, non-jittery fill.
 */
import { useScroll, useSpring, motion } from 'motion/react';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  // Spring smoothing removes the micro-jitter from fast scrolling
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping:   30,
    restDelta: 0.001,
  });

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
