import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import styles from './Intro.module.css';

interface IntroProps {
  active: boolean;
  progress: MotionValue<number>;
  soundEnabled: boolean;
  soundAvailable: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}

/** Transparent controls over the actual hero: the world and typography never swap pages. */
export default function Intro({
  active,
  progress,
  soundEnabled,
  soundAvailable,
  onToggleSound,
  onSkip,
}: IntroProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!active) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
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
      if (!window.location.hash.includes('section=')) {
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
    [0.16, 0.28, 0.42, 0.52],
    [0, 0.9, 0.9, 0]
  );
  const markScale = useTransform(progress, [0.16, 0.42, 0.52], [0.82, 1, 1.08]);
  const markY = useTransform(progress, [0.16, 0.42, 0.52], [18, 0, -18]);
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
        A digital world forms from light, then becomes Nicolas Gatta’s
        portfolio. Sound is off. Skip at any time.
      </p>
      <motion.div
        className={styles.identity}
        style={{ opacity: markOpacity, scale: markScale, y: markY }}
        aria-hidden="true"
      >
        <span className={styles.identityRule} />
        <strong>Nicolas Gatta</strong>
        <span className={styles.identityMeta}>SYSTEM / IDENTITY DETECTED</span>
        <span className={styles.identityRule} />
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
