import type { ReactNode } from 'react';
import { Terminal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from '../navigation/Navigation';
import BackNavigation from '../navigation/BackNavigation';
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
        <div className={`page-shell ${styles.inner}`}>
          <div>
            <Link to="/" className={styles.logo}>
              Nicolas Gatta<span>_</span>
            </Link>
            <p>Thoughtfully engineered. Always evolving.</p>
          </div>
          <div className={styles.links}>
            <button
              onClick={() => window.dispatchEvent(new Event('nico:terminal'))}
              aria-label="Open the hidden terminal"
            >
              <Terminal size={16} />
              <span>Terminal</span>
              <kbd>⌃ `</kbd>
            </button>
          </div>
        </div>
        <div className={`page-shell ${styles.bottom}`}>
          <span>© {new Date().getFullYear()} Nicolas Gatta</span>
          <span>Built with React / TypeScript / Three.js</span>
          <span className={styles.status}>
            <i />
            SYSTEM ONLINE
          </span>
        </div>
      </footer>
    </>
  );
}
