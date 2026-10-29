import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from './DeveloperOverlay.module.css';

interface Label {
  id: string;
  name: string;
  x: number;
  y: number;
}

export default function DeveloperOverlay({ onClose }: { onClose: () => void }) {
  const { pathname } = useLocation();
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [fps, setFps] = useState(0);
  const [labels, setLabels] = useState<Label[]>([]);
  useEffect(() => {
    let updateFrame = 0;
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      const marked = [
        ...document.querySelectorAll<HTMLElement>('[data-component]'),
      ];
      const elements = marked.length
        ? marked
        : [
            ...document.querySelectorAll<HTMLElement>(
              'header, main > section, footer'
            ),
          ];
      setLabels(
        elements
          .map((element, index) => {
            const rect = element.getBoundingClientRect();
            return {
              id: `${element.tagName}-${index}`,
              name:
                element.dataset.component ||
                (element.id
                  ? `${element.tagName.toLowerCase()}#${element.id}`
                  : element.tagName.toLowerCase()),
              x: Math.max(5, rect.left),
              y: rect.top,
            };
          })
          .filter((label) => label.y > 30 && label.y < window.innerHeight - 20)
      );
    };
    const schedule = () => {
      cancelAnimationFrame(updateFrame);
      updateFrame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(updateFrame);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
    };
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    let frames = 0;
    let last = performance.now();
    const count = (now: number) => {
      frames++;
      if (now - last > 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      frame = requestAnimationFrame(count);
    };
    const change = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        frames = 0;
        last = performance.now();
        frame = requestAnimationFrame(count);
      }
    };
    change();
    document.addEventListener('visibilitychange', change);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', change);
    };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.grid} aria-hidden="true" />
      {labels.map((label) => (
        <span
          key={label.id}
          className={styles.component}
          style={{ left: label.x + 5, top: label.y + 4 }}
          aria-hidden="true"
        >
          &lt;{label.name} /&gt;
        </span>
      ))}
      <div
        className={styles.panel}
        role="region"
        aria-label="Developer mode diagnostics"
      >
        <span className={styles.dot} />
        <strong>DEVELOPER MODE</strong>
        <span>
          {viewport.width} × {viewport.height}
        </span>
        <span>{fps || '—'} FPS</span>
        <button onClick={onClose} aria-label="Disable developer mode">
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
