import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

/**
 * Animates a number from 0 to `target` using requestAnimationFrame
 * when the attached ref enters the viewport.
 *
 * @param {string}   target     - e.g. "500+" or "95%"
 * @param {number}   duration   - animation duration in ms (default 1800)
 * @param {Function} onComplete - optional callback fired once when the
 *                                count reaches its final value
 *
 * @returns {[ref, displayValue, isDone]}
 *
 * Design note — why onComplete is stored in a ref:
 *   If onComplete were included in the animation useEffect's dependency
 *   array, any parent that passes an inline arrow function would cause the
 *   effect to tear down and restart on every re-render (e.g. when a
 *   mouse-tracking component higher in the tree causes frequent re-renders).
 *   Storing it in a ref means the animation effect only re-runs when
 *   isInView, target, or duration actually change — not when the callback
 *   reference changes — eliminating erratic counter restarts.
 */
export function useCountUp(target, duration = 1800, onComplete) {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const [count, setCount] = useState(0);
  const [done,  setDone]  = useState(false);

  const rafId    = useRef(null);
  const firedCb  = useRef(false);

  // Always keep the ref in sync with the latest callback without
  // causing the animation effect to re-run.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isInView) return;

    // Parse numeric portion from strings like "500+" or "95%"
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
      // ease-out cubic
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

    // ⚠️ onCompleteRef is intentionally excluded — it's a stable ref object.
    // handleComplete / onComplete are NOT in this array: including them would
    // restart the animation whenever the parent re-renders with a new function
    // reference (e.g. due to mouse-tracking state updates elsewhere in the tree).
  }, [isInView, target, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  const suffix       = String(target).replace(/[\d,]/g, '');
  const displayValue = isInView ? `${count}${suffix}` : `0${suffix}`;

  return [ref, displayValue, done];
}
