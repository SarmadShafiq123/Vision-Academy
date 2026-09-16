import { useEffect, useState } from 'react';
import { getLenis } from '../lib/lenis';

/**
 * Returns the live Lenis instance once it has been initialised,
 * or null while the app is still mounting.
 *
 * This hook does NOT trigger re-renders on scroll — it only re-renders
 * once when the instance transitions from null → live on mount.
 *
 * @returns {import('lenis').default | null}
 */
export function useLenisInstance() {
  const [instance, setInstance] = useState(() => getLenis());

  useEffect(() => {
    if (!instance) {
      setInstance(getLenis());
    }
  }, [instance]);

  return instance;
}
