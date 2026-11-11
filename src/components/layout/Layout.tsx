import type { ReactNode } from 'react';
import { ArrowUpRight, Terminal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navigation from '../navigation/Navigation';
import BackNavigation from '../navigation/BackNavigation';
import { profile } from '../../data/profile';
import styles from './Layout.module.css';

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <>
      <a
        className={styles.skip}
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        {children}
        <BackNavigation />
      </main>
      <footer className={`${styles.footer} ${pathname !== '/' ? styles.withBack : ''}`}>
        <div className={`page-shell ${styles.bottom}`}>
          <span>© {new Date().getFullYear()} Nicolas Gatta</span>
          <nav className={styles.links} aria-label="Social links">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={13} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </nav>
          <button
            type="button"
            className={styles.status}
            data-terminal-trigger
            onClick={() => window.dispatchEvent(new Event('nico:terminal'))}
            aria-label="Terminal connected — open terminal"
            title="Open terminal (Ctrl + `)"
          >
            <i aria-hidden="true" />
            <Terminal size={13} aria-hidden="true" />
            TERMINAL CONNECTED
          </button>
        </div>
      </footer>
    </>
  );
}
