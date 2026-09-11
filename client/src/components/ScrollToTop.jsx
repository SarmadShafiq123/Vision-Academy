/**
 * ScrollToTop
 * Floating circular button, bottom-right corner, that fades+scales in
 * once the user scrolls more than 400px, then smooth-scrolls to top via Lenis.
 *
 * Visibility is driven by Lenis's scroll event (same source as Lenis itself uses),
 * falling back to native window scroll if Lenis isn't ready.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useLenis } from '../context/LenisContext';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReduced        = useReducedMotion();
  const lenisRef              = useLenis();

  useEffect(() => {
    const lenis = lenisRef?.current;

    if (lenis) {
      const onScroll = ({ scroll }) => setVisible(scroll > 400);
      lenis.on('scroll', onScroll);
      return () => lenis.off('scroll', onScroll);
    }

    // Fallback: native scroll
    const onNativeScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    return () => window.removeEventListener('scroll', onNativeScroll);
  // lenisRef is a stable ref — only re-run if identity changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenisRef]);

  const handleClick = () => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(0, {
        duration: prefersReduced ? 0 : 1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          onClick={handleClick}
          aria-label="Scroll to top"
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={prefersReduced   ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          whileHover={prefersReduced ? {} : { scale: 1.1 }}
          whileTap={prefersReduced  ? {} : { scale: 0.92 }}
          className={[
            'fixed bottom-8 right-6 z-50',
            'w-11 h-11 rounded-full',
            'bg-[#1a3a8f] dark:bg-[#3d5fc4] text-white shadow-lg',
            'flex items-center justify-center',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
            'cursor-pointer',
          ].join(' ')}
        >
          <ArrowUp size={20} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
