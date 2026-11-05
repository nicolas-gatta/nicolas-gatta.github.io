import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Nicolas Gatta — Data Engineer | AI & Software',
  '/cv': 'CV — Nicolas Gatta',
  '/projects': 'Selected Work — Nicolas Gatta',
  '/contact': 'Contact — Nicolas Gatta',
};
export default function RouteEffects() {
  const { pathname, search, key } = useLocation();
  useEffect(() => {
    document.title =
      titles[pathname] ||
      (pathname.startsWith('/projects/')
        ? 'Project — Nicolas Gatta'
        : 'Page not found — Nicolas Gatta');
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
  }, [pathname, search, key]);
  return null;
}
