import type { ReactNode } from 'react';
import { ArrowUpRight, Code2, ExternalLink, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../navigation/Navigation';
import { profile } from '../../data/profile';
import styles from './Layout.module.css';

export default function Layout({ children }: { children: ReactNode }) {
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
      </main>
      <footer className={styles.footer}>
        <div className={`page-shell ${styles.inner}`}>
          <div>
            <Link to="/" className={styles.logo}>
              N.GATTA<span>_</span>
            </Link>
            <p>Thoughtfully engineered. Always evolving.</p>
          </div>
          <div className={styles.links}>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Nicolas Gatta on GitHub (opens in a new tab)"
            >
              <Code2 size={16} />
              <span>GitHub</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Nicolas Gatta on LinkedIn (opens in a new tab)"
            >
              <ExternalLink size={16} />
              <span>LinkedIn</span>
              <ArrowUpRight size={12} />
            </a>
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
          <span>Built with purpose. And a little curiosity.</span>
          <span className={styles.status}>
            <i />
            SYSTEM ONLINE
          </span>
        </div>
      </footer>
    </>
  );
}
