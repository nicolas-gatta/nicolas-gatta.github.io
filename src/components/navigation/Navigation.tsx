import { useEffect, useRef, useState } from 'react';
import { Download, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../../data/profile';
import { useTheme } from '../../features/theme/useTheme';
import styles from './Navigation.module.css';

const links = [
  { label: 'Home', section: 'home', to: '/' },
  { label: 'About', section: 'about', to: '/?section=about' },
  { label: 'Experience', section: 'experience', to: '/?section=experience' },
  { label: 'Projects', section: 'projects', to: '/?section=projects' },
  { label: 'CV', section: 'cv', to: '/?section=cv' },
  { label: 'Contact', section: 'contact', to: '/?section=contact' },
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  const themeToggle = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme } = useTheme();
  const nav = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('home');
  useEffect(() => {
    if (location.pathname !== '/') return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerHeight =
        nav.current?.closest('header')?.getBoundingClientRect().height ?? 85;
      const readingLine =
        headerHeight + Math.min(window.innerHeight * 0.2, 128);
      let current = 'home';
      for (const link of links) {
        const section = document.getElementById(link.section);
        if (section) {
          const contentTop = section.getBoundingClientRect().top +
            (parseFloat(getComputedStyle(section).paddingTop) || 0);
          if (contentTop <= readingLine) current = link.section;
        }
      }
      if (
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2
      )
        current = 'contact';
      setActiveSection(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    const main = document.getElementById('main-content');
    if (main) observer.observe(main);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [location.pathname]);
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
          themeToggle.current,
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
          aria-label="Nicolas Gatta — Nicolas Gatta home"
        >
          <span className={styles.mark} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          Nicolas Gatta
          <span className={styles.dot} aria-hidden="true">
            _
          </span>
        </Link>
        <div className={styles.controls}>
          <button
            ref={themeToggle}
            className={styles.themeToggle}
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'light'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
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
        </div>
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
                location.pathname === '/'
                  ? activeSection === link.section
                    ? 'location'
                    : undefined
                  : location.pathname === `/${link.section}` ||
                      location.pathname.startsWith(`/${link.section}/`)
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
