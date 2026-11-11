import { useId, useRef } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { projects } from '../../data/projects';
import styles from './ProjectExplorer.module.css';

const orderedProjects = [...projects].sort(
  (a, b) => Number(b.featured) - Number(a.featured)
);
const technologies = [...new Set(projects.flatMap((project) => project.tags))]
  .sort((a, b) => a.localeCompare(b));

export default function ProjectExplorer({
  initialCount = 3,
  headingLevel = 3,
}: {
  initialCount?: number;
  headingLevel?: 2 | 3;
}) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const id = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const requestedTechnology = params.get('technology') || '';
  const technology = technologies.includes(requestedTechnology)
    ? requestedTechnology
    : '';
  const expanded = params.get('expanded') === 'true';
  const matches = orderedProjects.filter(
    (project) => !technology || project.tags.includes(technology)
  );
  const visible = expanded ? matches : matches.slice(0, initialCount);
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const returnParams = new URLSearchParams(params);
  if (location.pathname === '/') returnParams.set('section', 'projects');
  const projectReturnTo = `${location.pathname}${returnParams.size ? `?${returnParams}` : ''}`;

  const filter = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('technology', value);
    else next.delete('technology');
    next.delete('expanded');
    setParams(next, { replace: true });
  };

  const toggleExpanded = () => {
    const next = new URLSearchParams(params);
    if (expanded) next.delete('expanded');
    else next.set('expanded', 'true');
    setParams(next, { replace: true });
    if (expanded) {
      requestAnimationFrame(() =>
        toggle.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
      );
    }
  };

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar}>
        <label className={styles.filter} htmlFor={`${id}-technology`}>
          <span>
            <SlidersHorizontal size={13} aria-hidden="true" />
            Filter by technology
          </span>
          <span className={styles.selectWrap}>
            <select
              id={`${id}-technology`}
              value={technology}
              onChange={(event) => filter(event.target.value)}
            >
              <option value="">All technologies</option>
              {technologies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </span>
        </label>
        {technology && (
          <button type="button" className={styles.clear} onClick={() => filter('')}>
            <X size={13} aria-hidden="true" />Clear filter
          </button>
        )}
        <p className={styles.count} role="status" aria-atomic="true">
          <strong>{visible.length}</strong> / {matches.length} {matches.length === 1 ? 'project' : 'projects'}
          {technology && <span> · {technology}</span>}
        </p>
      </div>
      <div id={`${id}-list`} className={styles.grid}>
        {visible.map((project) => (
          <Link
            key={project.id}
            id={`project-card-${project.id}`}
            to={`/projects/${project.id}`}
            state={{ projectReturnTo, projectReturnId: project.id }}
            className={styles.card}
            aria-labelledby={`${id}-${project.id}-title`}
          >
            <div className={styles.cardTop}>
              <span>{project.category}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
            <Heading id={`${id}-${project.id}-title`}>{project.title}</Heading>
            <p className={styles.summary}>{project.summary}</p>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={tag === technology ? styles.matchedTag : undefined}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.cardFoot}>
              <span>
                <i aria-hidden="true" />
                {project.year}
              </span>
              <span>{project.number}</span>
            </div>
          </Link>
        ))}
      </div>
      {matches.length > initialCount && (
        <div className={styles.expandRow}>
          <button
            ref={toggle}
            type="button"
            className={`button ${styles.expand}`}
            aria-expanded={expanded}
            aria-controls={`${id}-list`}
            onClick={toggleExpanded}
          >
            {expanded ? 'Collapse projects' : `Expand · ${matches.length - visible.length} more projects`}
            {expanded
              ? <ChevronUp size={16} aria-hidden="true" />
              : <ChevronDown size={16} aria-hidden="true" />}
          </button>
        </div>
      )}
    </div>
  );
}
