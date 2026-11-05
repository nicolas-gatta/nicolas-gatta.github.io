import { useEffect, useId, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { organizations } from '../../data/organizations';
import styles from './ExperienceAirship.module.css';

/** A little airborne billboard for the organizations in the experience timeline. */
export default function ExperienceAirship() {
  const element = useRef<HTMLDivElement>(null);
  const inView = useInView(element, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const gradient = useId().replace(/:/g, '');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const running = inView && visible && !reducedMotion && !paused && !hovered && !focused;
  const current = organizations[index];

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setIndex((previous) => (previous + 1) % organizations.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <div
      ref={element}
      className={styles.airship}
      data-testid="experience-airship"
      data-running={running}
      role="group"
      aria-label="Professional experience airship"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
    >
      <div className={styles.flight}>
        <svg className={styles.drawing} viewBox="0 0 440 270" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`${gradient}-hull`} x1="180" y1="16" x2="210" y2="146" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--airship-highlight)" />
              <stop offset="0.45" stopColor="var(--airship-body)" />
              <stop offset="1" stopColor="var(--airship-shadow)" />
            </linearGradient>
            <linearGradient id={`${gradient}-shine`} x1="36" y1="0" x2="390" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--airship-line)" stopOpacity="0" />
              <stop offset="0.45" stopColor="var(--airship-line)" stopOpacity="0.8" />
              <stop offset="1" stopColor="var(--airship-line)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="var(--airship-line)" strokeWidth="1.1" strokeLinejoin="round">
            <path d="m318 42 61-29 4 65-48 5Z" fill="var(--airship-shadow)" />
            <path d="m341 100 50 49-62-12-24-29Z" fill="var(--airship-shadow)" />
            <path d="m369 75 45 16-42 13-25-15Z" fill="var(--airship-body)" />
            <path
              d="M48 112C20 99 20 72 43 50 81 11 236 4 326 39c30 12 53 30 64 51-26 23-81 42-161 49-88 8-152-5-181-27Z"
              fill={`url(#${gradient}-hull)`}
            />
            <g opacity="0.35">
              <path d="M85 30c-35 28-35 72 0 101M155 16c-33 39-33 88 0 126M230 19c-22 35-22 84 0 120M300 30c-13 28-13 66 0 98" />
              <path d="M33 68c87-27 241-20 353 18M34 100c92 21 233 21 350-7" />
            </g>
            <path d="M39 83c91-9 228-6 348 7" stroke={`url(#${gradient}-shine)`} strokeWidth="2" />
            <path d="m160 140 17 16h53l11-16" fill="var(--airship-shadow)" />
            <path d="m126 132 19 28m130-28-7 28" opacity="0.7" />
            <rect x="181" y="143" width="13" height="6" rx="1" fill="#78d2de" stroke="none" />
            <rect x="199" y="143" width="13" height="6" rx="1" fill="#78d2de" stroke="none" opacity="0.6" />
            <rect x="135" y="157" width="155" height="78" rx="5" fill="var(--airship-shadow)" />
            <path d="M143 164h10m-10 0v10m139-10h-10m10 0v10M143 228h10m-10 0v-10m139 10h-10m10 0v-10" stroke="#7bd7e6" />
            <path d="m330 128 9 20" />
            <g className={styles.propeller}>
              <path d="m329 150 18 8m-18 0 18-8" strokeWidth="2" />
            </g>
          </g>
          <circle cx="382" cy="76" r="2" fill="#77e1d4" />
          <text x="174" y="72" fill="var(--airship-line)" fontFamily="monospace" fontSize="8" letterSpacing="3">NG—01</text>
        </svg>
        <Link
          className={styles.screen}
          to="/?section=experience"
          aria-label={`View professional experience: ${current.name}`}
          data-company={current.id}
        >
          {organizations.map((organization, position) => (
            <img
              key={organization.id}
              src={organization.logo}
              alt={position === index ? organization.name : ''}
              aria-hidden={position !== index}
              className={organization.id === 'takeda' ? styles.takeda : undefined}
              data-active={position === index}
              draggable="false"
            />
          ))}
        </Link>
        <div className={styles.controls}>
          {organizations.map((organization, position) => (
            <button
              key={organization.id}
              type="button"
              aria-label={`Show ${organization.name} logo`}
              aria-pressed={position === index}
              onClick={() => setIndex(position)}
            >
              <span className={styles.dot} />
            </button>
          ))}
          <button
            type="button"
            aria-label={paused ? 'Play company logos' : 'Pause company logos'}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? <Play size={11} /> : <Pause size={11} />}
          </button>
        </div>
      </div>
    </div>
  );
}
