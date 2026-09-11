/**
 * LoadingScreen
 * Branded initial-load splash. Shows for at most 700ms on the FIRST
 * page load only (tracked via sessionStorage so subsequent navigations
 * never see it). Fades out and calls onDone when the timer expires.
 *
 * Dark mode: background uses dark page colour so there's no jarring
 * flash between the splash and the app in dark mode.
 */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/vision.png';

const DURATION_MS = 700;
const SESSION_KEY = 'va_loaded';

export default function LoadingScreen({ show, onDone }) {
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(id);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white dark:bg-[#0d1425]"
          aria-label="Loading Vision Academy"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            {/* Always white-backed so the dark-blue logo is legible in both modes */}
            <div className="bg-white rounded-2xl px-5 py-3 shadow-md border border-gray-100">
              <img src={logo} alt="Vision Academy" className="h-16" />
            </div>
            {/* Subtle pulse dot */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-[#29b6f6]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Returns true if this is the first visit this session.
 * Call once at module scope (inside App) and memoize.
 */
export function isFirstLoad() {
  if (typeof sessionStorage === 'undefined') return false;
  if (sessionStorage.getItem(SESSION_KEY)) return false;
  sessionStorage.setItem(SESSION_KEY, '1');
  return true;
}
