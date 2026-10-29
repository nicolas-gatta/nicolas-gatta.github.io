import { useCallback, useRef, useState } from 'react';
import { readSessionList, writeSession } from '../easterEggs/storage';
import { isAchievementId, type AchievementId } from './achievements';

export function useAchievements() {
  const unlocked = useRef(
    new Set(readSessionList('ng:achievements', isAchievementId))
  );
  const [queue, setQueue] = useState<AchievementId[]>([]);
  const unlock = useCallback((id: AchievementId) => {
    if (unlocked.current.has(id)) return;
    unlocked.current.add(id);
    writeSession('ng:achievements', [...unlocked.current]);
    setQueue((current) => [...current, id]);
  }, []);
  const dismiss = useCallback(
    () => setQueue((current) => current.slice(1)),
    []
  );
  return { achievement: queue[0], unlock, dismiss };
}
