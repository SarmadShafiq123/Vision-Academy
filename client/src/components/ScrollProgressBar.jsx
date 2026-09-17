import { useEffect } from 'react';
import { useSpring, motion, useMotionValue } from 'motion/react';
import { useLenisInstance } from '../hooks/useLenisInstance';

const SPRING_STIFFNESS = 200;
const SPRING_DAMPING   = 30;
const SPRING_REST      = 0.001;
const BAR_HEIGHT_PX    = 3;
const BAR_Z_INDEX      = 9999;

export default function ScrollProgressBar() {
  const lenis       = useLenisInstance();
  const rawProgress = useMotionValue(0);

  const scaleX = useSpring(rawProgress, {
    stiffness: SPRING_STIFFNESS,
    damping:   SPRING_DAMPING,
    restDelta: SPRING_REST,
  });

  useEffect(() => {
    if (lenis) {
      const onScroll = ({ progress }) => rawProgress.set(progress);
      lenis.on('scroll', onScroll);
      return () => lenis.off('scroll', onScroll);
    }

    const onNativeScroll = () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      rawProgress.set(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    return () => window.removeEventListener('scroll', onNativeScroll);
  }, [lenis, rawProgress]);

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
        height:          BAR_HEIGHT_PX,
        background:      'linear-gradient(to right, #1a3a8f, #29b6f6)',
        zIndex:          BAR_Z_INDEX,
      }}
    />
  );
}
