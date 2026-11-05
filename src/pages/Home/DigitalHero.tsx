import {
  Component,
  lazy,
  Suspense,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowDown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Intro from '../../features/intro/Intro';
import { useWorldSequence } from '../../features/intro/useWorldSequence';
import { useWorldSound } from '../../features/intro/useWorldSound';
import { profile } from '../../data/profile';
import styles from './DigitalHero.module.css';
import ExperienceAirship from './ExperienceAirship';

const DigitalWorld = lazy(() => import('../../features/intro/DigitalWorld'));
class WorldBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function ArchitecturalLetter({
  letter,
  index,
  line,
  progress,
}: {
  letter: string;
  index: number;
  line: number;
  progress: MotionValue<number>;
}) {
  const start = 0.51 + line * 0.07 + index * 0.018;
  const stroke = useTransform(
    progress,
    [start - 0.08, start + 0.025],
    ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']
  );
  const fill = useTransform(
    progress,
    [start + 0.04, start + 0.16],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
  );
  const glint = useTransform(
    progress,
    [start + 0.025, start + 0.075, start + 0.17],
    [0, 0.7, 0]
  );
  return (
    <span className={styles.letter}>
      <span className={styles.letterSpace}>{letter}</span>
      <motion.span
        className={styles.letterOutline}
        style={{ clipPath: stroke }}
      >
        {letter}
      </motion.span>
      <motion.span className={styles.letterFill} style={{ clipPath: fill }}>
        {letter}
      </motion.span>
      <motion.span
        className={styles.letterLight}
        style={{ opacity: glint, clipPath: fill }}
      >
        {letter}
      </motion.span>
    </span>
  );
}
function WorldFallback() {
  return (
    <svg
      className={styles.fallback}
      viewBox="0 0 1440 860"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="world-fallback-fog" x2="0" y2="1">
          <stop stopColor="#080b0e" />
          <stop offset="1" stopColor="#173039" />
        </linearGradient>
      </defs>
      <g stroke="#315561" strokeWidth=".7" fill="none">
        <path d="M0 520H1440M0 650H1440M0 820H1440M720 430 100 860M720 430 400 860M720 430 720 860M720 430 1040 860M720 430 1340 860" />
        <path d="m960 380 80-30 80 30v190l-80 30-80-30zm0 0 80 30 80-30m-80 30v190M1170 420l40-18 40 18v100l-40 18-40-18m40-100v118" />
      </g>
    </svg>
  );
}

export default function DigitalHero() {
  const section = useRef<HTMLElement>(null);
  const { variant, progress, active, reducedMotion, finish } =
    useWorldSequence();
  const scrollProgress = useMotionValue(0);
  const { enabled, available, toggleSound } = useWorldSound({
    progress,
    active,
    reducedMotion,
    variant,
  });
  const detailsOpacity = useTransform(progress, [0.79, 0.97], [0, 1]);
  const detailsY = useTransform(progress, [0.79, 1], [15, 0]);
  const metaOpacity = useTransform(progress, [0.86, 1], [0, 1]);
  const titleOpacity = useTransform(progress, [0.39, 0.49], [0, 1]);
  const drift = useTransform(progress, [0.44, 0.7, 1], [1, 0.48, 0]);
  const rise = useTransform(progress, [0.44, 1], [-26, 0]);
  const angle = useTransform(progress, [0.44, 1], [24, 0]);
  const scale = useTransform(progress, [0.44, 0.75, 1], [0.66, 0.92, 1]);
  const titleTransform = useMotionTemplate`perspective(1200px) translate3d(calc(${drift} * var(--title-travel)), ${rise}px, 0) rotateY(${angle}deg) scale(${scale})`;
  const guideScale = useTransform(progress, [0.72, 0.97], [0, 1]);
  const guideBorder = useTransform(
    progress,
    [0, 0.79, 1],
    ['#25384000', '#25384000', '#25384080']
  );

  useLayoutEffect(() => {
    let frame = 0;
    const update = () => {
      const rect = section.current?.getBoundingClientRect();
      if (!rect) return;
      scrollProgress.set(
        Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.8)))
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      delete document.documentElement.dataset.worldIntro;
    };
  }, [scrollProgress]);
  useLayoutEffect(() => {
    const update = () => {
      document.documentElement.dataset.worldIntro =
        active && progress.get() < 0.88 ? 'active' : 'ready';
    };
    update();
    return progress.on('change', update);
  }, [active, progress]);
  return (
    <section
      ref={section}
      className={styles.hero}
      data-testid="digital-hero"
      data-component="DigitalHero"
      data-intro-variant={variant}
      data-intro-active={active}
      aria-labelledby="hero-title"
    >
      <div className={styles.environment} aria-hidden="true">
        <WorldFallback />
        <WorldBoundary>
          <Suspense fallback={null}>
            <DigitalWorld
              progress={progress}
              scrollProgress={scrollProgress}
              reducedMotion={reducedMotion}
              active={active}
              variant={variant}
            />
          </Suspense>
        </WorldBoundary>
      </div>
      <div className={styles.shade} aria-hidden="true" />
      {!active && <ExperienceAirship />}
      <motion.div
        className={styles.inner}
        style={{ borderColor: guideBorder }}
      >
        <motion.div
          className={styles.metadata}
          style={{ opacity: metaOpacity }}
        >
          <span>ENGINEERING / WITH PURPOSE</span>
          <span>PERSONAL PORTFOLIO — 2026</span>
        </motion.div>
        <div className={styles.main}>
          <div className={styles.content}>
            <motion.p
              className={styles.location}
              style={{ opacity: detailsOpacity, y: detailsY }}
            >
              <i />
              <MapPin size={11} />
              BASED IN BELGIUM
            </motion.p>
            <motion.h1
              id="hero-title"
              aria-label="NICOLAS GATTA."
              className={styles.name}
              style={{ opacity: titleOpacity, transform: titleTransform }}
            >
              <span className={styles.word} aria-hidden="true">
                {'NICOLAS'.split('').map((letter, index) => (
                  <ArchitecturalLetter
                    key={index}
                    letter={letter}
                    index={index}
                    line={0}
                    progress={progress}
                  />
                ))}
              </span>
              <span className={styles.word} aria-hidden="true">
                {'GATTA'.split('').map((letter, index) => (
                  <ArchitecturalLetter
                    key={index}
                    letter={letter}
                    index={index}
                    line={1}
                    progress={progress}
                  />
                ))}
                <motion.span
                  className={styles.period}
                  style={{ opacity: detailsOpacity }}
                >
                  .
                </motion.span>
              </span>
            </motion.h1>
            <motion.div style={{ opacity: detailsOpacity, y: detailsY }}>
              <div className={styles.role}>
                <span>DATA ENGINEER</span>
                <span>AI / DATA / SOFTWARE</span>
              </div>
              <p className={styles.statement}>{profile.statement}</p>
            </motion.div>
          </div>
          <motion.div
            className={styles.worldNote}
            style={{ opacity: metaOpacity }}
            aria-hidden="true"
          >
            <span className={styles.noteLine} />
            <span>
              FROM INDIVIDUAL PARTS.
              <br />
              <strong>TO CONNECTED SYSTEMS.</strong>
            </span>
            <span className={styles.worldCoordinates}>
              01 — INFINITE POSSIBILITIES
            </span>
          </motion.div>
        </div>
        <motion.div className={styles.foot} style={{ opacity: detailsOpacity }}>
          <Link to="/?section=about">
            <span className={styles.scrollMark}>
              <ArrowDown size={13} />
            </span>
            A little more about me
          </Link>
          <span>
            <i />
            BUILT ON CURIOSITY. DRIVEN BY ENGINEERING.
          </span>
        </motion.div>
        <motion.div
          className={styles.guide}
          style={{ scaleX: guideScale }}
          aria-hidden="true"
        />
      </motion.div>
      <Intro
        active={active}
        progress={progress}
        variant={variant}
        onSkip={finish}
        soundEnabled={enabled}
        soundAvailable={available}
        onToggleSound={toggleSound}
      />
    </section>
  );
}
