import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects, projectCategories } from '../../data/projects';
import ProjectVisual from './ProjectVisual';
import styles from './Projects.module.css';

export default function ProjectsPage() {
  const [category, setCategory] = useState('All work');
  const [query, setQuery] = useState('');
  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === 'All work' || project.category === category) &&
          `${project.title} ${project.tags.join(' ')} ${project.summary}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [category, query]
  );

  return (
    <div className={`page-shell ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">THE WORK / SELECTED SYSTEMS</p>
        <div className={styles.headerRow}>
          <h1>
            Built with
            <br />
            <span>purpose.</span>
          </h1>
          <p>
            From intelligent models to the infrastructure beneath them. A closer
            look at the systems I explore.
          </p>
        </div>
      </header>
      <div className={styles.tools}>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filter projects by category"
        >
          {projectCategories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={category === item ? styles.activeFilter : ''}
            >
              {item}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <Search size={16} aria-hidden="true" />
          <span className={styles.srOnly}>Search projects</span>
          <input
            type="search"
            placeholder="Find a project"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <p className={styles.draftNote}>
        First edition · project descriptions and diagrams are illustrative
        drafts awaiting final case studies.
      </p>
      <p className={styles.srOnly} aria-live="polite">
        {filteredProjects.length} projects found.
      </p>
      <div className={styles.grid}>
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className={styles.project}
          >
            <div className={styles.projectTop}>
              <span>PROJECT / {project.number}</span>
              <span>{project.year}</span>
            </div>
            <ProjectVisual type={project.visual} />
            <div className={styles.projectBottom}>
              <div>
                <p className={styles.category}>{project.category}</p>
                <h2>{project.title}</h2>
              </div>
              <span className={styles.openIcon}>
                <ArrowUpRight size={24} aria-hidden="true" />
              </span>
            </div>
            <p className={styles.summary}>{project.summary}</p>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <span className={styles.openLabel}>
              OPEN PROJECT <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <div className={styles.empty}>
          <h2>No matching systems.</h2>
          <p>Try a different search or explore all the work.</p>
          <button
            className="button"
            onClick={() => {
              setQuery('');
              setCategory('All work');
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      <footer className={styles.endNote}>
        <span className="eyebrow">HAVE A DIFFERENT CHALLENGE?</span>
        <Link to="/contact">
          Let’s build something. <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
