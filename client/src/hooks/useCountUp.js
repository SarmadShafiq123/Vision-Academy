import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

const INVIEW_MARGIN = '-50px';

/**
 * Animates a number from 0 to the numeric portion of `target` using
 * requestAnimationFrame once the attached ref enters the viewport.
 *
 * @param {string}   target     - Display string, e.g. "500+" or "95%"
 * @param {number}   duration   - Animation duration in milliseconds
 * @param {Function} onComplete - Optional callback fired once on completion
 * @returns {[React.RefObject, string, boolean]} [ref, displayValue, isDone]
 */
export function useCountUp(target, duration = 1800, onComplete) {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: INVIEW_MARGIN });

  const [count, setCount] = useState(0);
  const [done,  setDone]  = useState(false);

  const rafId         = useRef(null);
  const firedCb       = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isInView) return;

    const numericTarget = parseInt(String(target).replace(/\D/g, ''), 10);
    if (isNaN(numericTarget)) {
      setCount(target);
      setDone(true);
      if (!firedCb.current) {
        firedCb.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    let startTime = null;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setCount(numericTarget);
        setDone(true);
        if (!firedCb.current) {
          firedCb.current = true;
          onCompleteRef.current?.();
        }
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isInView, target, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  const suffix       = String(target).replace(/[\d,]/g, '');
  const displayValue = isInView ? `${count}${suffix}` : `0${suffix}`;

  return [ref, displayValue, done];
}
