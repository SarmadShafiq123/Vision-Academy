import Lenis from 'lenis';

const LENIS_DURATION = 1.1;
const LENIS_TOUCH_MULTIPLIER = 1.5;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function createLenisInstance() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return new Lenis({
    duration: prefersReducedMotion ? 0 : LENIS_DURATION,
    easing: easeOutCubic,
    smoothWheel: true,
    touchMultiplier: LENIS_TOUCH_MULTIPLIER,
  });
}

let lenisInstance = null;
let rafId = null;

/**
 * Initialises the Lenis singleton and starts its RAF loop.
 * Safe to call multiple times — will not create duplicate instances.
 * @returns {Lenis} the live Lenis instance
 */
export function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = createLenisInstance();

  function raf(time) {
    lenisInstance.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return lenisInstance;
}

/**
 * Destroys the Lenis singleton and cancels its RAF loop.
 * Call on app unmount / hot-reload cleanup.
 */
export function destroyLenis() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/**
 * Returns the live Lenis instance, or null if not yet initialised.
 * @returns {Lenis|null}
 */
export function getLenis() {
  return lenisInstance;
}
