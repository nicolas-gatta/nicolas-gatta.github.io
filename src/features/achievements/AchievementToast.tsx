import { useEffect } from 'react';
import { Compass, X } from 'lucide-react';
import { achievementDefinitions, type AchievementId } from './achievements';
import styles from './AchievementToast.module.css';

export default function AchievementToast({
  id,
  onDismiss,
}: {
  id?: AchievementId;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!id) return;
    const timer = window.setTimeout(onDismiss, 4400);
    return () => window.clearTimeout(timer);
  }, [id, onDismiss]);
  const achievement = id ? achievementDefinitions[id] : undefined;
  return (
    <div className={styles.region} aria-live="polite" aria-atomic="true">
      {achievement && (
        <div className={styles.toast} key={id}>
          <div className={styles.icon}>
            <Compass size={18} />
          </div>
          <div>
            <span className={styles.label}>A SMALL DISCOVERY</span>
            <strong>{achievement.title}</strong>
            <p>{achievement.description}</p>
          </div>
          <button
            onClick={onDismiss}
            aria-label="Dismiss discovery notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
