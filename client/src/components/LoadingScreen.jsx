import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/vision-logo-transparent.png';

const SPLASH_DURATION_MS      = 700;
const SPLASH_FADE_DURATION_S  = 0.35;
const PULSE_DOT_DURATION_S    = 1;
const SESSION_LOADED_KEY      = 'va_loaded';

export default function LoadingScreen({ show, onDone }) {
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(onDone, SPLASH_DURATION_MS);
    return () => clearTimeout(id);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: SPLASH_FADE_DURATION_S, ease: 'easeOut' }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white dark:bg-[#0d1425]"
          aria-label="Loading Vision Academy"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: SPLASH_FADE_DURATION_S, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            <img src={logo} alt="Vision Academy" className="h-16" />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: PULSE_DOT_DURATION_S, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-[#29b6f6]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Returns true if this is the first visit this browser session.
 * Tracks via sessionStorage so subsequent navigations skip the splash.
 * @returns {boolean}
 */
export function isFirstLoad() {
  if (typeof sessionStorage === 'undefined') return false;
  if (sessionStorage.getItem(SESSION_LOADED_KEY)) return false;
  sessionStorage.setItem(SESSION_LOADED_KEY, '1');
  return true;
}
