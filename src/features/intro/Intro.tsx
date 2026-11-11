import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import type { WorldVariant } from './useWorldSequence';
import styles from './Intro.module.css';

interface IntroProps {
  active: boolean;
  progress: MotionValue<number>;
  variant: WorldVariant;
  soundEnabled: boolean;
  soundAvailable: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}

/** Transparent controls over the actual hero: the world and typography never swap pages. */
export default function Intro({
  active,
  progress,
  variant,
  soundEnabled,
  soundAvailable,
  onToggleSound,
  onSkip,
}: IntroProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returning = variant === 'short';
  useEffect(() => {
    if (!active) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const entryHash = window.location.hash;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    element
      ?.querySelector<HTMLButtonElement>('[data-skip]')
      ?.focus({ preventScroll: true });
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      // Deep links own their focus and scroll destination.
      if (!window.location.hash.includes('section=') || window.location.hash === entryHash) {
        const target =
          previous?.isConnected &&
          previous !== document.body &&
          !element?.contains(previous)
            ? previous
            : document.getElementById('main-content');
        target?.focus({ preventScroll: true });
      }
    };
  }, [active]);
  const markOpacity = useTransform(
    progress,
    returning ? [0, 0.12, 0.6, 0.85] : [0.16, 0.28, 0.42, 0.52],
    [0, 0.9, 0.9, 0]
  );
  const markScale = useTransform(
    progress,
    returning ? [0, 0.45, 0.85] : [0.16, 0.42, 0.52],
    returning ? [0.98, 1, 1.02] : [0.82, 1, 1.08]
  );
  const markY = useTransform(
    progress,
    returning ? [0, 0.45, 0.85] : [0.16, 0.42, 0.52],
    returning ? [6, 0, -6] : [18, 0, -18]
  );
  const connectionDraw = useTransform(progress, [0, 0.65], [0, 1]);
  if (!active) return null;
  return (
    <dialog
      ref={dialog}
      className={styles.controls}
      aria-label="Optional portfolio introduction"
      aria-describedby="world-intro-description"
      onCancel={(event) => {
        event.preventDefault();
        onSkip();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>(
            'button:not(:disabled)'
          )
        );
        const first = buttons[0],
          last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <p className="sr-only" id="world-intro-description">
        {returning
          ? 'A brief welcome-back pulse opens the portfolio.'
          : 'A digital world forms from light, then becomes Nicolas Gatta’s portfolio.'}
        {' '}Sound is {soundEnabled ? 'on' : 'off'}.
        {!returning && ' Enable sound for the robotic connection greeting.'}
        {' '}Skip at any time.
      </p>
      <motion.div
        className={`${styles.identity} ${returning ? styles.returning : ''}`}
        data-testid={returning ? 'return-intro-mark' : 'identity-intro-mark'}
        style={{ opacity: markOpacity, scale: markScale, y: markY }}
        aria-hidden="true"
      >
        {returning ? (
          <>
            <svg
              className={styles.connectionMark}
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="29" strokeDasharray="2 7" opacity="0.35" />
              <motion.circle
                cx="32"
                cy="32"
                r="22"
                transform="rotate(-90 32 32)"
                style={{ pathLength: connectionDraw }}
              />
              <path d="m24 32 6 6 11-13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <strong>WELCOME BACK</strong>
          </>
        ) : (
          <>
            <span className={styles.identityRule} />
            <strong>Nicolas Gatta</strong>
            <span className={styles.identityMeta}>IDENTITY CONFIRM. WELCOME USER.</span>
            <span className={styles.identityRule} />
          </>
        )}
      </motion.div>
      <div className={styles.controlBar}>
        <button
          className={styles.sound}
          disabled={!soundAvailable}
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          aria-pressed={soundEnabled}
          onClick={onToggleSound}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{soundEnabled ? 'MUTE SOUND' : 'ENABLE SOUND'}</span>
        </button>
        <button
          className={styles.skip}
          data-skip
          aria-label="Skip intro and explore the portfolio"
          onClick={onSkip}
        >
          SKIP
          <ArrowRight size={14} />
        </button>
      </div>
    </dialog>
  );
}
