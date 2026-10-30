import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { createDigitalWorld } from './DigitalWorldRenderer';

export interface DigitalWorldProps {
  progress: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  active: boolean;
  variant: 'full' | 'short' | 'still';
}

/** One persistent environment, shared by the opening shot and the settled hero. */
export default function DigitalWorld({
  progress,
  scrollProgress,
  reducedMotion,
  active,
  variant,
}: DigitalWorldProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ reducedMotion, active, variant });
  settings.current = { reducedMotion, active, variant };

  useEffect(() => {
    if (!canvas.current) return;
    return createDigitalWorld(
      canvas.current,
      progress,
      scrollProgress,
      settings
    );
  }, [progress, scrollProgress, reducedMotion]);

  return (
    <canvas
      ref={canvas}
      data-testid="digital-world"
      aria-hidden="true"
      data-digital-world="procedural"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}
