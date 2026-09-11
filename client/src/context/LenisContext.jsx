/**
 * LenisContext
 *
 * Initialises a single Lenis smooth-scroll instance at the app root and
 * exposes it via context so any component can call lenis.scrollTo() etc.
 *
 * Design decisions:
 *  - prefers-reduced-motion → Lenis is created with `duration: 0` (effectively
 *    native/instant) so the instance still exists for programmatic scrollTo calls
 *    but users who opt out of motion get no smooth easing.
 *  - RAF loop is driven here, not inside Lenis's own autoRaf option, so we keep
 *    full control and can pause on tab-hidden if needed in future.
 *  - The instance is stored in a ref AND exposed via context. Components that
 *    only need to call scrollTo() consume the context; App-internal logic uses
 *    the ref directly.
 */
import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration:  reduced ? 0 : 1.1,
      easing:    (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
      smoothWheel: true,
      // Don't touch touch devices — native momentum scroll is already smooth
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // RAF loop
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Expose the ref value — consumers read lenisRef.current which is always
  // the live instance (or null before mount / after unmount).
  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}

/**
 * useLenis()
 * Returns the Lenis ref. Access the instance via ref.current.
 * Safe to call at any time — ref.current is null until the provider mounts.
 */
export function useLenis() {
  return useContext(LenisContext);
}
