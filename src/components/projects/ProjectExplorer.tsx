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
import TechnologyFilter from './TechnologyFilter';
import styles from './ProjectExplorer.module.css';

const orderedProjects = [...projects].sort(
  (a, b) => Number(b.featured) - Number(a.featured)
);
const technologies = [...new Set(projects.flatMap((project) => project.tags))]
  .sort((a, b) => a.localeCompare(b));
const statuses = [
  { value: 'released', label: 'Released', match: 'RELEASED' },
  { value: 'development', label: 'In development', match: 'IN DEVELOPMENT' },
  { value: 'maintained', label: 'Actively maintained', match: 'ACTIVELY MAINTAINED' },
];

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
  const technology = params.get('technology') || '';
  const query = technology.trim().toLowerCase();
  const exactTechnology = technologies.find((item) => item.toLowerCase() === query);
  const selectedStatuses = statuses.filter((status) =>
    params.getAll('status').includes(status.value)
  );
  const isMatchingTag = (tag: string) => exactTechnology
    ? tag === exactTechnology
    : tag.toLowerCase().includes(query);
  const expanded = params.get('expanded') === 'true';
  const matches = orderedProjects.filter(
    (project) =>
      (!query || project.tags.some(isMatchingTag)) &&
      (selectedStatuses.length === 0 ||
        selectedStatuses.some((status) => status.match === project.year))
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

  const filterStatus = (value: string) => {
    const selected = selectedStatuses.map((status) => status.value);
    const nextStatuses = !value ? [] : selected.includes(value)
      ? selected.filter((status) => status !== value)
      : [...selected, value];
    const next = new URLSearchParams(params);
    next.delete('status');
    if (nextStatuses.length < statuses.length) {
      nextStatuses.forEach((status) => next.append('status', status));
    }
    next.delete('expanded');
    setParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(params);
    ['technology', 'status', 'expanded'].forEach((key) => next.delete(key));
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
        <div className={styles.filter}>
          <label htmlFor={`${id}-technology`}>
            <SlidersHorizontal size={13} aria-hidden="true" />
            Filter by technology
          </label>
          <TechnologyFilter
            id={`${id}-technology`}
            options={technologies}
            value={technology}
            onChange={filter}
          />
        </div>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Status</span>
          <div className={styles.statusTags} role="group" aria-label="Filter projects by status">
            <button type="button" aria-pressed={selectedStatuses.length === 0} onClick={() => filterStatus('')}>
              All statuses
            </button>
            {statuses.map((status) => (
              <button
                key={status.value}
                type="button"
                aria-pressed={selectedStatuses.includes(status)}
                onClick={() => filterStatus(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
        {(technology || selectedStatuses.length > 0) && (
          <button type="button" className={styles.clear} onClick={clearFilters}>
            <X size={13} aria-hidden="true" />Clear filters
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
                  className={query && isMatchingTag(tag) ? styles.matchedTag : undefined}
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
      {matches.length === 0 && (
        <div className={styles.empty}>
          <p>No projects match these filters.</p>
          <span>Try another technology or status.</span>
          <button type="button" className="button" onClick={clearFilters}>Reset filters</button>
        </div>
      )}
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
