import { useLayoutEffect, useRef, useState } from 'react';
import styles from './ConstructionGuide.module.css';

// Keep completed sections built when navigating away and back in this document.
const constructed = new Set<string>();

/** A descending light trail traces the section as its content is assembled. */
export default function ConstructionGuide() {
  const guide = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 600 });

  useLayoutEffect(() => {
    const section = guide.current?.parentElement;
    if (!section) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    const resize = new ResizeObserver(() => {
      setSize({ width: section.clientWidth, height: section.clientHeight });
    });
    resize.observe(section);
    const complete = () => {
      window.clearTimeout(timer);
      observer.disconnect();
      constructed.add(section.id);
      section.dataset.construction = 'ready';
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        constructed.add(section.id);
        section.dataset.construction = 'drawing';
        timer = window.setTimeout(complete, 950);
      },
      { rootMargin: '0px 0px -56px 0px' }
    );
    const onMotionChange = () => {
      if (motion.matches) {
        complete();
      }
    };
    // Keyboard navigation must never wait for a visual effect.
    section.addEventListener('focusin', complete);
    motion.addEventListener('change', onMotionChange);
    if (motion.matches || constructed.has(section.id)) complete();
    else {
      section.dataset.construction = 'pending';
      observer.observe(section);
    }
    return () => {
      window.clearTimeout(timer);
      resize.disconnect();
      observer.disconnect();
      section.removeEventListener('focusin', complete);
      motion.removeEventListener('change', onMotionChange);
      delete section.dataset.construction;
    };
  }, []);

  const path = `M 0 -56 V 0 H ${size.width} V ${size.height} H 0 V 0`;
  return (
    <svg
      ref={guide}
      className={styles.track}
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.outline} d={path} pathLength="1" />
      <path className={styles.trail} d={path} pathLength="1" />
    </svg>
  );
}
