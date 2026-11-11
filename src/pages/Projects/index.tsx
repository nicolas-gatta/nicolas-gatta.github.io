import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectExplorer from '../../components/projects/ProjectExplorer';
import styles from './Projects.module.css';

export default function ProjectsPage() {
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
            A few things I’ve built. Pick a technology, explore a project,
            or expand the list to see more.
          </p>
        </div>
      </header>
      <ProjectExplorer initialCount={6} headingLevel={2} />
      <p className={styles.draftNote}>
        Scope, technologies and project status are sourced from the current CV.
      </p>
      <footer className={styles.endNote}>
        <span className="eyebrow">HAVE A DIFFERENT CHALLENGE?</span>
        <Link to="/contact">
          Let’s build something. <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
