/**
 * ScrollToTop
 * Floating circular button, bottom-right corner, that fades+scales in
 * once the user scrolls more than 400px, then smooth-scrolls to top.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible]     = useState(false);
  const prefersReduced            = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () =>
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });

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
            'bg-[#1a3a8f] text-white shadow-lg',
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
