import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../../data/projects';
import ProjectVisual from '../Projects/ProjectVisual';
import styles from './ProjectDetail.module.css';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((item) => item.id === id);
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Project | Nicolas Gatta`;
      window.dispatchEvent(
        new CustomEvent('nico:achievement', { detail: 'engineer' })
      );
    }
  }, [project]);
  if (!project)
    return (
      <div className={`page-shell ${styles.missing}`}>
        <p className="eyebrow">PROJECT NOT FOUND</p>
        <h1>This module is offline.</h1>
        <p>The project you requested could not be found.</p>
        <Link className="button button-primary" to="/projects">
          <ArrowLeft size={16} aria-hidden="true" /> All projects
        </Link>
      </div>
    );
  const nextProject =
    projects[(projects.indexOf(project) + 1) % projects.length];
  const jumpTo = (target: string) => {
    const section = document.getElementById(target);
    section?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
    section?.focus({ preventScroll: true });
  };

  return (
    <article className={`page-shell ${styles.page}`}>
      <Link className={styles.back} to="/projects">
        <ArrowLeft size={14} aria-hidden="true" /> ALL PROJECTS
      </Link>
      <header className={styles.header}>
        <p className="eyebrow">
          PROJECT / {project.number} <span className={styles.slash}>/</span>{' '}
          {project.category.toUpperCase()}
        </p>
        <div className={styles.titleRow}>
          <h1>{project.title}</h1>
          <span className={styles.year}>{project.year}</span>
        </div>
        <p className={styles.lead}>{project.summary}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </header>
      <figure className={styles.figure}>
        <ProjectVisual type={project.visual} large />
        <figcaption>
          SYSTEM FLOW{' '}
          <span>FIG. {project.number} / DOCUMENTED SCOPE</span>
        </figcaption>
      </figure>
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <span className="eyebrow">IN THIS MODULE</span>
          <nav aria-label="Case study contents">
            <button type="button" onClick={() => jumpTo('overview')}>
              01 / Overview
            </button>
            <button type="button" onClick={() => jumpTo('problem')}>
              02 / The problem
            </button>
            <button type="button" onClick={() => jumpTo('architecture')}>
              03 / Architecture
            </button>
            <button type="button" onClick={() => jumpTo('challenges')}>
              04 / Challenges
            </button>
            <button type="button" onClick={() => jumpTo('results')}>
              05 / Results
            </button>
          </nav>
          {project.github && (
            <a
              className={styles.source}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code2 size={16} aria-hidden="true" /> VIEW SOURCE{' '}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
        </aside>
        <div className={styles.chapters}>
          <section id="overview" tabIndex={-1}>
            <span className={styles.chapterNumber}>01 / OVERVIEW</span>
            <h2>The complete picture.</h2>
            <p>{project.overview}</p>
          </section>
          <section id="problem" tabIndex={-1}>
            <span className={styles.chapterNumber}>02 / THE PROBLEM</span>
            <h2>Start with the right question.</h2>
            <p>{project.problem}</p>
          </section>
          <section id="architecture" tabIndex={-1}>
            <span className={styles.chapterNumber}>
              03 / SYSTEM FLOW
            </span>
            <h2>From input to outcome.</h2>
            <ol className={styles.architecture}>
              {project.architecture.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step}</strong>
                  {index !== project.architecture.length - 1 && (
                    <ArrowRight size={14} aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
            <div className={styles.techLabel}>FOCUS AREAS</div>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
          <section id="challenges" tabIndex={-1}>
            <span className={styles.chapterNumber}>
              04 / ENGINEERING CHALLENGES
            </span>
            <h2>The interesting tradeoffs.</h2>
            <p>{project.challenges}</p>
          </section>
          {project.screenshots?.length ? (
            <section aria-label="Project screenshots">
              <span className={styles.chapterNumber}>PROJECT IMAGES</span>
              <div className={styles.screenshots}>
                {project.screenshots.map((screenshot) => (
                  <img
                    key={screenshot.src}
                    src={screenshot.src}
                    alt={screenshot.alt}
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          ) : null}
          <section id="results" tabIndex={-1}>
            <span className={styles.chapterNumber}>
              05 / RESULTS & NEXT STEPS
            </span>
            <h2>Evidence matters.</h2>
            <p>{project.results}</p>
          </section>
        </div>
      </div>
      <Link to={`/projects/${nextProject.id}`} className={styles.next}>
        <div>
          <span className="eyebrow">NEXT SYSTEM / {nextProject.number}</span>
          <h2>{nextProject.title}</h2>
        </div>
        <span className={styles.nextArrow}>
          <ArrowUpRight size={32} aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
