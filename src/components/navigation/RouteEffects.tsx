import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { ProjectReturnState } from './BackNavigation';

const titles: Record<string, string> = {
  '/': 'Nicolas Gatta — Data Engineer | AI & Software',
  '/cv': 'CV — Nicolas Gatta',
  '/projects': 'Selected Work — Nicolas Gatta',
  '/contact': 'Contact — Nicolas Gatta',
};
export default function RouteEffects() {
  const { pathname, search, key, state } = useLocation();
  const previous = useRef<{ pathname: string; search: string } | null>(null);
  useEffect(() => {
    const last = previous.current;
    previous.current = { pathname, search };
    document.title =
      titles[pathname] ||
      (pathname.startsWith('/projects/')
        ? 'Project — Nicolas Gatta'
        : 'Page not found — Nicolas Gatta');
    // Updating the project controls should keep the visitor at the list.
    const withoutProjectFilters = (value: string) => {
      const params = new URLSearchParams(value);
      params.delete('technology');
      params.delete('expanded');
      return params.toString();
    };
    if (
      last?.pathname === pathname && last.search !== search &&
      withoutProjectFilters(last.search) === withoutProjectFilters(search)
    ) return;

    const restoreProject = (state as ProjectReturnState | null)?.restoreProject;
    if (restoreProject) {
      let attempts = 0;
      const restore = () => {
        const card = document.getElementById(`project-card-${restoreProject}`);
        if (card) {
          card.scrollIntoView({ block: 'center', behavior: 'instant' });
          card.focus({ preventScroll: true });
        } else if (++attempts < 15) timer = window.setTimeout(restore, 100);
      };
      let timer = window.setTimeout(restore, 60);
      return () => window.clearTimeout(timer);
    }
    const section = new URLSearchParams(search).get('section');
    if (pathname === '/' && section) {
      let attempts = 0;
      const scroll = () => {
        const target = document.getElementById(section);
        if (target) {
          const header = document.querySelector('header');
          const headerHeight = header?.getBoundingClientRect().height ?? 85;
          const padding = parseFloat(getComputedStyle(target).paddingTop) || 0;
          window.scrollTo({
            top:
              window.scrollY + target.getBoundingClientRect().top +
              padding - headerHeight - 18,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
              .matches
              ? 'instant'
              : 'smooth',
          });
          target.focus({ preventScroll: true });
        } else if (++attempts < 15) timer = window.setTimeout(scroll, 100);
      };
      let timer = window.setTimeout(scroll, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname, search, key, state]);
  return null;
}
