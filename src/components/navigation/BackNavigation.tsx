import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BackNavigation.module.css';

export interface ProjectReturnState {
  projectReturnTo?: string;
  projectReturnId?: string;
  restoreProject?: string;
}

export default function BackNavigation() {
  const { pathname, state } = useLocation();
  const origin = state as ProjectReturnState | null;
  const isProject = pathname.startsWith('/projects/');
  if (pathname === '/') return null;
  const sections: Record<string, string> = {
    '/projects': 'projects', '/cv': 'cv', '/contact': 'contact',
  };
  const projectReturnTo = origin?.projectReturnTo;
  const to = isProject
    ? projectReturnTo?.startsWith('/') && !projectReturnTo.startsWith('//')
      ? projectReturnTo
      : '/projects'
    : sections[pathname] ? `/?section=${sections[pathname]}` : '/';

  return (
    <nav className={styles.navigation} aria-label="Return navigation" data-back-navigation>
      <Link
        to={to}
        state={isProject && origin?.projectReturnId ? { restoreProject: origin.projectReturnId } : undefined}
        className={styles.back}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {isProject ? 'Back to projects' : 'Back to home'}
      </Link>
    </nav>
  );
}
