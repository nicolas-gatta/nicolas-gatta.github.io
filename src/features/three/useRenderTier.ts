import { useMemo } from 'react';

export type RenderTier = 'high' | 'medium' | 'low';

export function useRenderTier(): RenderTier {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return 'medium';
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency || 4;
    const compact = window.matchMedia('(max-width: 700px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || memory && memory <= 4 || cores <= 4) return 'low';
    if (compact || memory && memory <= 8 || cores <= 8) return 'medium';
    return 'high';
  }, []);
}
