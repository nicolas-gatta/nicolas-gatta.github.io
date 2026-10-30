import {
  ArrowDown,
  ArrowUpRight,
  Download,
  ExternalLink,
  FileText,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import { experiences, experienceDisclaimer } from '../../data/experience';
import { skills } from '../../data/skills';
import { education } from '../../data/education';
import { certifications } from '../../data/certifications';
import { projects } from '../../data/projects';
import styles from './CV.module.css';

export default function CVPage() {
  const jumpToCV = () => {
    const content = document.getElementById('cv-content');
    content?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
    content?.focus({ preventScroll: true });
  };
  return (
    <div className={`page-shell ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">THE PROFILE / CURRICULUM VITAE</p>
        <div className={styles.headerRow}>
          <div>
            <h1>
              Engineering,
              <br />
              <span>at a glance.</span>
            </h1>
            <p>Data. Intelligence. Software. The systems that connect them.</p>
          </div>
          <button type="button" className={styles.jump} onClick={jumpToCV}>
            <ArrowDown size={22} aria-hidden="true" />
            <span>EXPLORE THE CV</span>
          </button>
        </div>
      </header>
      <div className={styles.documentBar}>
        <div>
          <FileText size={20} aria-hidden="true" />
          <span>
            <strong>Nicolas_Gatta_CV.pdf</strong>
            <small>PDF DOCUMENT · READY TO DOWNLOAD</small>
          </span>
        </div>
        <a className="button button-primary" href={profile.cvPath} download>
          <Download size={15} aria-hidden="true" /> Download PDF
        </a>
      </div>
      <div className={styles.body} id="cv-content" tabIndex={-1}>
        <aside className={styles.identity}>
          <span className={styles.monogram} aria-hidden="true">
            NG<span>_</span>
          </span>
          <h2>{profile.name}</h2>
          <p className={styles.role}>{profile.role}</p>
          <dl>
            <div>
              <dt>BASED IN</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>FOCUS</dt>
              <dd>Data Engineering / AI</dd>
            </div>
            <div>
              <dt>LANGUAGES</dt>
              <dd>{profile.languages.join(' / ')}</dd>
            </div>
          </dl>
          <a className={styles.email} href={`mailto:${profile.email}`}>
            <Mail size={14} aria-hidden="true" /> Get in touch{' '}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <div className={styles.identityLinks}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={11} aria-hidden="true" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          </div>
        </aside>
        <div className={styles.content}>
          <section className={styles.introduction}>
            <span className="eyebrow">01 / PROFILE</span>
            <h2>From the data to the whole system.</h2>
            <p>
              AI Engineer and Data Engineer with professional experience in AI
              workflow automation, process transformation, data-center
              operations, retrieval-augmented generation and computer vision.
            </p>
            <p>
              My background combines a Master’s specialization in Artificial
              Intelligence and Data Analytics with software, data and MLOps
              skills used across production and personal projects.
            </p>
          </section>
          <section>
            <span className="eyebrow">02 / EXPERIENCE</span>
            <h2>An evolving engineering practice.</h2>
            <p className={styles.note}>{experienceDisclaimer}</p>
            <div className={styles.experiences}>
              {experiences.map((item) => (
                <article key={item.id} className={styles.experience}>
                  <span className={styles.date}>{item.year}</span>
                  <div>
                    <h3>{item.company}</h3>
                    <p>{item.role}</p>
                    <p>{item.summary}</p>
                    <ul>
                      {item.responsibilities.map((responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                      ))}
                    </ul>
                    {item.technologies.length > 0 && (
                      <div className={styles.tags}>
                        {item.technologies.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section>
            <span className="eyebrow">03 / COMPETENCIES</span>
            <h2>A connected set of disciplines.</h2>
            <p className={styles.note}>
              Technical and professional competencies listed in the current CV.
            </p>
            <div className={styles.skillGrid}>
              {skills.map((group) => (
                <div key={group.category}>
                  <h3>{group.category}</h3>
                  <div className={styles.tags}>
                    {group.items.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <span className="eyebrow">04 / EDUCATION</span>
            <h2>Always learning.</h2>
            {education.length ? (
              education.map((item) => (
                <article key={item.id} className={styles.education}>
                  <h3>{item.qualification}</h3>
                  <p>
                    {item.institution} · {item.period}
                  </p>
                  {item.description && <p>{item.description}</p>}
                </article>
              ))
            ) : (
              <p>
                Education details are available in the downloadable CV.
              </p>
            )}
          </section>
          <section>
            <span className="eyebrow">05 / CERTIFICATIONS</span>
            <h2>Validated foundations.</h2>
            <div className={styles.skillGrid}>
              {certifications.map((certification) => (
                <div key={certification.issuer}>
                  <h3>{certification.issuer}</h3>
                  <div className={styles.tags}>
                    {certification.credentials.map((credential) => (
                      <span key={credential}>{credential}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <span className="eyebrow">06 / SELECTED PROJECTS</span>
            <h2>Ideas made tangible.</h2>
            <div className={styles.projectList}>
              {projects
                .filter((project) => project.featured)
                .map((project) => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <span>{project.number}</span>
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.tags.slice(0, 3).join(' / ')}</p>
                    </div>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>
                ))}
            </div>
            <p className={styles.note}>
              Scope, technologies and project status sourced from the current
              CV.
            </p>
          </section>
          <section className={styles.pdfSection}>
            <span className="eyebrow">07 / THE DOCUMENT</span>
            <div className={styles.pdfHeader}>
              <h2>The portable version.</h2>
              <a
                href={profile.cvPath}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open PDF <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.pdfPreview}>
              <iframe
                src={`${profile.cvPath}#view=FitH&toolbar=0`}
                title="Nicolas Gatta curriculum vitae PDF preview"
                loading="lazy"
              />
              <p>
                Preview unavailable?{' '}
                <a
                  href={profile.cvPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open the PDF directly.
                </a>
              </p>
            </div>
            <a
              className={`button ${styles.mobilePdf}`}
              href={profile.cvPath}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={16} aria-hidden="true" /> Open PDF in a new tab{' '}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </section>
        </div>
      </div>
      <footer className={styles.footer}>
        <div>
          <span className="eyebrow">THE NEXT CHAPTER</span>
          <h2>Let’s build something.</h2>
        </div>
        <Link className="button button-primary" to="/?section=contact">
          Contact me <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
