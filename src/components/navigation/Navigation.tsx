import { useEffect, useRef, useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../../data/profile';
import styles from './Navigation.module.css';

const links = [
  { label: 'About', to: '/?section=about' },
  { label: 'Experience', to: '/?section=experience' },
  { label: 'Projects', to: '/projects' },
  { label: 'CV', to: '/cv' },
  { label: 'Lab', to: '/lab' },
  { label: 'Contact', to: '/contact' },
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const closeOnDesktop = () => {
      if (!media.matches) setOpen(false);
    };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === 'Tab') {
        const items = [
          toggle.current,
          ...Array.from(
            nav.current?.querySelectorAll<HTMLAnchorElement>('a') || []
          ),
        ].filter(Boolean) as HTMLElement[];
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items[items.length - 1]?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === items[items.length - 1]
        ) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <header className={styles.header}>
      <div className={`page-shell ${styles.bar}`}>
        <Link
          to="/"
          className={styles.logo}
          aria-label="N.GATTA — Nicolas Gatta home"
        >
          <span className={styles.mark} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          N.GATTA
          <span className={styles.dot} aria-hidden="true">
            _
          </span>
        </Link>
        <button
          ref={toggle}
          className={styles.toggle}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          ref={nav}
          id="main-navigation"
          aria-label="Main navigation"
          className={`${styles.nav} ${open ? styles.open : ''}`}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              aria-current={
                (location.pathname !== '/' &&
                  location.pathname.startsWith(link.to)) ||
                location.pathname + location.search === link.to
                  ? 'page'
                  : undefined
              }
              className={styles.navLink}
            >
              {link.label}
            </Link>
          ))}
          <a className={styles.download} href={profile.cvPath} download>
            <Download size={14} />
            Download CV
          </a>
        </nav>
      </div>
    </header>
  );
}
