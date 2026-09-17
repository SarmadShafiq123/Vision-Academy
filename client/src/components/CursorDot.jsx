import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';

const DOT_SIZE_PX            = 8;
const DOT_HOVER_SCALE        = 2;
const DOT_IDLE_COLOR         = '#29b6f6';
const DOT_HOVER_BORDER       = '2px solid #29b6f6';
const DOT_IDLE_BORDER        = '2px solid transparent';
const SPRING_STIFFNESS       = 800;
const SPRING_DAMPING         = 60;
const SPRING_MASS            = 0.4;
const HOVER_SPRING_STIFFNESS = 400;
const HOVER_SPRING_DAMPING   = 28;
const HOVER_SPRING_MASS      = 0.5;
const INITIAL_OFFSCREEN      = -100;

function isFinePonterDevice() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

export default function CursorDot() {
  const prefersReduced = useReducedMotion();

  const [isFinePointer, setIsFinePointer] = useState(false);
  const [visible,       setVisible]       = useState(false);
  const [hovered,       setHovered]       = useState(false);

  const mouseX = useMotionValue(INITIAL_OFFSCREEN);
  const mouseY = useMotionValue(INITIAL_OFFSCREEN);

  const dotX = useSpring(mouseX, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING, mass: SPRING_MASS });
  const dotY = useSpring(mouseY, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING, mass: SPRING_MASS });

  useEffect(() => {
    const fine = isFinePonterDevice();
    setIsFinePointer(fine);
    if (!fine) return;

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovered(!!(el && el.closest(INTERACTIVE_SELECTOR)));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        opacity:         visible ? 1 : 0,
        scale:           hovered ? DOT_HOVER_SCALE : 1,
        backgroundColor: hovered ? 'transparent' : DOT_IDLE_COLOR,
        border:          hovered ? DOT_HOVER_BORDER : DOT_IDLE_BORDER,
      }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: HOVER_SPRING_STIFFNESS, damping: HOVER_SPRING_DAMPING, mass: HOVER_SPRING_MASS }
      }
      style={{
        x:             dotX,
        y:             dotY,
        position:      'fixed',
        top:           0,
        left:          0,
        width:         DOT_SIZE_PX,
        height:        DOT_SIZE_PX,
        borderRadius:  '50%',
        pointerEvents: 'none',
        zIndex:        99999,
        translateX:    '-50%',
        translateY:    '-50%',
        willChange:    'transform',
      }}
    />
  );
}
