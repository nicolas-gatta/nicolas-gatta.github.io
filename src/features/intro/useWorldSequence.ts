import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMotionValue, useReducedMotion } from 'framer-motion';
import { readSession, writeSession } from '../easterEggs/storage';

export type WorldVariant = 'full' | 'short' | 'still';
export const worldDurations = { full: 6800, short: 1600, still: 0 };
export const worldSessionKey = 'ng:world-intro-seen:v1';
const enteredAtHome =
  !window.location.hash || /^#\/(?:\?|$)/.test(window.location.hash);
let presentedInDocument = false;

/** A finite presentation clock, independent of asset loading and paused in hidden tabs. */
export function useWorldSequence() {
  const { search } = useLocation();
  const reducedMotion = !!useReducedMotion();
  const [variant, setVariant] = useState<WorldVariant>(() => {
    if (
      presentedInDocument ||
      !enteredAtHome ||
      new URLSearchParams(search).has('section') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return 'still';
    return readSession<boolean>(worldSessionKey, false) === true
      ? 'short'
      : 'full';
  });
  const progress = useMotionValue(variant === 'still' ? 1 : 0);
  const [active, setActive] = useState(variant !== 'still');
  const elapsed = useRef(0);
  const finish = useCallback(() => {
    progress.set(1);
    setActive(false);
    writeSession(worldSessionKey, true);
  }, [progress]);
  const replay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    elapsed.current = 0;
    setVariant('full');
    progress.set(0);
    setActive(true);
  }, [progress]);

  useEffect(() => {
    presentedInDocument = true;
    if (!active || variant === 'still') return;
    writeSession(worldSessionKey, true);
    const duration = reducedMotion ? 450 : worldDurations[variant];
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += Math.max(0, now - last);
      last = now;
      const next = Math.min(1, elapsed.current / duration);
      progress.set(next);
      if (next >= 1) finish();
      else frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    resume();
    document.addEventListener('visibilitychange', resume);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [active, variant, progress, finish, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || new URLSearchParams(search).has('section')) finish();
  }, [reducedMotion, search, finish]);
  return { variant, progress, active, reducedMotion, finish, replay };
}
