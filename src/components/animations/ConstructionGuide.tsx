import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import styles from './ConstructionGuide.module.css';

/** The opening's travelling line becomes a quiet guide through the professional sections. */
export default function ConstructionGuide() {
  const line = useRef<HTMLDivElement>(null);
  const visible = useInView(line, { once: true, margin: '0px 0px -40px 0px' });
  const reducedMotion = useReducedMotion();
  return (
    <div ref={line} className={styles.track} aria-hidden="true">
      <motion.span
        initial={false}
        animate={{ scaleX: visible ? 1 : 0, opacity: visible ? 0.5 : 0 }}
        transition={{
          duration: reducedMotion ? 0 : 1.1,
          ease: [0.16, 0.7, 0.2, 1],
        }}
      />
    </div>
  );
}
