import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

/**
 * Animates a number from 0 to `target` using requestAnimationFrame
 * when the attached ref enters the viewport.
 * Returns [ref, displayValue].
 */
export function useCountUp(target, duration = 1800) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);
  const rafId = useRef(null);

  useEffect(() => {
    if (!isInView) return;

    // Parse the numeric portion from strings like "5000+" or "95%"
    const numericTarget = parseInt(String(target).replace(/\D/g, ''), 10);
    if (isNaN(numericTarget)) {
      setCount(target);
      return;
    }

    let startTime = null;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setCount(numericTarget);
      }
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isInView, target, duration]);

  // Re-attach the numeric suffix (e.g. "+", "%")
  const suffix = String(target).replace(/[\d,]/g, '');
  const displayValue = isInView ? `${count}${suffix}` : '0';

  return [ref, displayValue];
}
