import { ArrowLeft, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
export default function NotFound() {
  return (
    <section
      className={`page-shell ${styles.page}`}
      aria-labelledby="notfound-title"
    >
      <p className="eyebrow">ERROR / 404 / CONNECTION LOST</p>
      <div className={styles.diagram} aria-hidden="true">
        <div />
        <Flame size={38} strokeWidth={0.8} />
        <div />
      </div>
      <p className={styles.system}>AN UNEXPECTED END TO THIS ROUTE</p>
      <h1 id="notfound-title">
        YOU DIED<span>.</span>
      </h1>
      <p className={styles.description}>
        The page you were looking for has returned to the bonfire.
      </p>
      <Link to="/" className="button button-primary">
        <ArrowLeft size={15} />
        Return Home
      </Link>
      <p className={styles.footnote}>Your progress is safe. Probably.</p>
    </section>
  );
}
