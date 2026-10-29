import {
  ArrowDownRight,
  ArrowRight,
  Cpu,
  FlaskConical,
  Settings2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CarIllustration,
  DeskIllustration,
} from '../../features/three/Illustrations';
import styles from './Lab.module.css';

export default function Lab() {
  return (
    <div className={`page-shell ${styles.page}`}>
      <div className={styles.topline}>
        <span className="eyebrow">
          BEYOND THE DAY JOB / PERSONAL EXPLORATIONS
        </span>
        <FlaskConical size={19} aria-hidden="true" />
      </div>
      <header className={styles.header}>
        <h1>
          The Lab<span>.</span>
        </h1>
        <div>
          <p>Engineering doesn’t stop at work.</p>
          <p className={styles.intro}>
            A space for curiosity. Hardware, home infrastructure and the
            engineering that makes interesting things work.
          </p>
        </div>
      </header>
      <div className={styles.experiences}>
        <Link to="/lab/computer" className={styles.card}>
          <div className={styles.cardTop}>
            <span>EXPERIENCE / 01</span>
            <Cpu size={17} aria-hidden="true" />
          </div>
          <DeskIllustration className={styles.art} />
          <div className={styles.cardBody}>
            <div>
              <span className="eyebrow">HARDWARE × SOFTWARE</span>
              <h2>The workstation</h2>
              <p>
                Boot into NICO OS. Look around the homelab and follow a few
                unexpected paths.
              </p>
            </div>
            <span className={styles.arrow}>
              <ArrowDownRight size={24} aria-hidden="true" />
            </span>
          </div>
          <span className={styles.cardLink}>
            ENTER COMPUTER <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
        <Link to="/lab/garage" className={`${styles.card} ${styles.garage}`}>
          <div className={styles.cardTop}>
            <span>EXPERIENCE / 02</span>
            <Settings2 size={17} aria-hidden="true" />
          </div>
          <CarIllustration className={styles.art} />
          <div className={styles.cardBody}>
            <div>
              <span className="eyebrow">MECHANICS × DESIGN</span>
              <h2>Dream garage</h2>
              <p>
                Rotary engines, clever drivetrains and machines with a different
                point of view.
              </p>
            </div>
            <span className={styles.arrow}>
              <ArrowDownRight size={24} aria-hidden="true" />
            </span>
          </div>
          <span className={styles.cardLink}>
            ENTER GARAGE <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
      </div>
      <div className={styles.note}>
        <span className={styles.dot} />
        <p>Take your time. There’s no right way to explore.</p>
        <Link to="/">
          Back to the portfolio <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
