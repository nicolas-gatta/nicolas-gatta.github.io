import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  isAchievementId,
  type AchievementId,
} from '../achievements/achievements';
import { useAchievements } from '../achievements/useAchievements';
import AchievementToast from '../achievements/AchievementToast';
import { type TerminalAction } from '../terminal/commands';
import { readSessionList, writeSession } from './storage';

const Terminal = lazy(() => import('../terminal/Terminal'));
const MatrixEffect = lazy(() => import('./MatrixEffect'));
const DeveloperOverlay = lazy(() => import('./DeveloperOverlay'));
const konami = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
const discoveryIds = [
  'terminal',
  'matrix',
  'system',
  'developer',
  'engineer',
  'sysadmin',
  'petrolhead',
  'curious',
  'explorer',
];
function isDiscovery(value: unknown): value is string {
  return typeof value === 'string' && discoveryIds.includes(value);
}

export default function SecretSystem() {
  const navigate = useNavigate();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [developerNotice, setDeveloperNotice] = useState(false);
  const konamiPosition = useRef(0);
  const discoveries = useRef(
    new Set(readSessionList('ng:discoveries', isDiscovery))
  );
  const { achievement, unlock, dismiss } = useAchievements();

  const discover = useCallback(
    (id: string, reward?: AchievementId) => {
      if (reward) unlock(reward);
      discoveries.current.add(id);
      writeSession('ng:discoveries', [...discoveries.current]);
      if (discoveries.current.size >= 5) unlock('explorer');
    },
    [unlock]
  );

  const openTerminal = useCallback(() => {
    setMatrixOpen(false);
    setTerminalOpen(true);
    discover('terminal', 'curious');
  }, [discover]);
  const closeTerminal = useCallback(() => setTerminalOpen(false), []);
  const closeMatrix = useCallback(() => setMatrixOpen(false), []);
  const closeDeveloper = useCallback(() => setDeveloperMode(false), []);

  useEffect(() => {
    const onTerminal = () => openTerminal();
    const onAchievement = (event: Event) => {
      const id: unknown = (event as CustomEvent).detail;
      if (isAchievementId(id)) discover(id, id);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.isComposing || event.repeat) return;
      if (event.ctrlKey && (event.code === 'Backquote' || event.key === '`')) {
        event.preventDefault();
        setMatrixOpen(false);
        discover('terminal', 'curious');
        setTerminalOpen((current) => !current);
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        target?.isContentEditable ||
        target?.closest('input, textarea, select') ||
        document.querySelector('dialog[open]')
      )
        return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const position = konamiPosition.current;
      if (key === konami[position]) {
        konamiPosition.current++;
        if (konamiPosition.current === konami.length) {
          konamiPosition.current = 0;
          setDeveloperMode((current) => !current);
          setDeveloperNotice(true);
          discover('developer');
        }
      } else konamiPosition.current = key === konami[0] ? 1 : 0;
    };
    window.addEventListener('nico:terminal', onTerminal);
    window.addEventListener('nico:achievement', onAchievement);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('nico:terminal', onTerminal);
      window.removeEventListener('nico:achievement', onAchievement);
      window.removeEventListener('keydown', onKey);
    };
  }, [discover, openTerminal]);

  useEffect(() => {
    if (!developerNotice) return;
    const timer = window.setTimeout(() => setDeveloperNotice(false), 3000);
    return () => window.clearTimeout(timer);
  }, [developerNotice]);

  const onAction = useCallback(
    (action: TerminalAction) => {
      const routes: Partial<Record<TerminalAction, string>> = {
        projects: '/projects',
        cv: '/cv',
      };
      const route = routes[action];
      if (route) {
        setTerminalOpen(false);
        navigate(route);
      }
      if (action === 'exit') setTerminalOpen(false);
      if (action === 'matrix') {
        discover('matrix');
        setTerminalOpen(false);
        setMatrixOpen(true);
      }
      if (action === 'system') discover('system');
    },
    [discover, navigate]
  );

  return createPortal(
    <>
      <Suspense fallback={null}>
        {terminalOpen && (
          <Terminal onClose={closeTerminal} onAction={onAction} />
        )}
        {matrixOpen && <MatrixEffect onClose={closeMatrix} />}
        {developerMode && <DeveloperOverlay onClose={closeDeveloper} />}
      </Suspense>
      <AchievementToast id={achievement} onDismiss={dismiss} />
      <span className="sr-only" role="status">
        {developerNotice
          ? `Developer mode ${developerMode ? 'enabled' : 'disabled'}.`
          : ''}
      </span>
    </>,
    document.body
  );
}
