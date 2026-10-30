import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowLeft, Binary } from 'lucide-react';
import styles from './MatrixEffect.module.css';

const glyphs = '01·+-<>[]{}01/\\=01';
const streams = Array.from({ length: 30 }, (_, column) =>
  Array.from(
    { length: 48 },
    (_, row) => glyphs[(column * 7 + row * 11) % glyphs.length]
  ).join('\n')
);

export default function MatrixEffect({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const element = dialog.current;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    const timer = window.setTimeout(onClose, 5500);
    return () => {
      window.clearTimeout(timer);
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [onClose]);
  return (
    <dialog
      ref={dialog}
      className={styles.matrix}
      aria-labelledby="matrix-title"
      aria-describedby="matrix-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className={styles.streams} aria-hidden="true">
        {streams.map((stream, index) => (
          <pre
            key={index}
            style={
              {
                '--duration': `${5 + (index % 6)}s`,
                '--delay': `${-(index % 7)}s`,
                '--opacity': 0.12 + (index % 4) * 0.05,
              } as CSSProperties
            }
          >
            {stream}
          </pre>
        ))}
      </div>
      <div className={styles.content}>
        <Binary size={23} strokeWidth={1.2} />
        <span className={styles.eyebrow}>A DIFFERENT VIEW OF THE SYSTEM</span>
        <h2 id="matrix-title">It's all connected.</h2>
        <p id="matrix-description">
          A brief glimpse behind the data. Returning automatically.
        </p>
        <button onClick={onClose} autoFocus>
          <ArrowLeft size={15} /> Back to reality <kbd>ESC</kbd>
        </button>
      </div>
    </dialog>
  );
}
