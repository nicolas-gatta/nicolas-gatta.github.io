import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Braces,
  Cpu,
  Database,
  FileText,
  Layers3,
  Network,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DigitalHero from './DigitalHero';
import ConstructionGuide from '../../components/animations/ConstructionGuide';
import { projects } from '../../data/projects';
import { organizations } from '../../data/organizations';
import ProjectVisual from '../Projects/ProjectVisual';
import ExperienceTimeline from './ExperienceTimeline';
import ContactSection from '../Contact/ContactSection';
import styles from './Home.module.css';

const focus = [
  {
    id: '01',
    title: 'Data Engineering',
    detail: 'Reliable pipelines. Useful data.',
    icon: Database,
  },
  {
    id: '02',
    title: 'Artificial Intelligence',
    detail: 'From experimentation to application.',
    icon: BrainCircuit,
  },
  {
    id: '03',
    title: 'Software Engineering',
    detail: 'Thoughtful tools. Complete systems.',
    icon: Braces,
  },
  {
    id: '04',
    title: 'Infrastructure',
    detail: 'Understanding every layer.',
    icon: Network,
  },
];
function LabIllustration({ garage = false }: { garage?: boolean }) {
  return (
    <svg viewBox="0 0 380 165" aria-hidden="true" className={styles.labDrawing}>
      <defs>
        <pattern
          id={garage ? 'garage-grid' : 'desk-grid'}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path d="M28 0H0V28" stroke="#bdcfc9" strokeWidth=".45" fill="none" />
        </pattern>
      </defs>
      <rect
        width="380"
        height="165"
        fill={`url(#${garage ? 'garage-grid' : 'desk-grid'})`}
        opacity=".5"
      />
      {garage ? (
        <g fill="none" stroke="#648e97" strokeWidth="1">
          <ellipse
            cx="193"
            cy="142"
            rx="149"
            ry="11"
            strokeDasharray="3 5"
            opacity=".45"
          />
          <path
            d="M46 106l20-26 58-7 40-37h82l43 36 37 7 11 33-13 15H52z"
            fill="#e3edeb"
          />
          <path d="M124 73h165M163 36l-8 37m89-37 28 37M182 41v27h66l-17-27z" />
          <path d="M69 80l32-1-10 14H57m235-17 25 6 7 12h-27z" fill="#c3e2e6" />
          <path d="M120 107h133m-94-26h83m-69 4h18" />
          <circle cx="111" cy="117" r="23" fill="#d9e4e1" />
          <circle cx="111" cy="117" r="13" />
          <path d="M111 104v26m-13-13h26m-22-9 18 18m-18 0 18-18" />
          <circle cx="278" cy="117" r="23" fill="#d9e4e1" />
          <circle cx="278" cy="117" r="13" />
          <path d="M278 104v26m-13-13h26m-22-9 18 18m-18 0 18-18" />
          <path d="M36 44v-13h13m294 13V31h-13" stroke="#35a6c8" />
        </g>
      ) : (
        <g fill="none" stroke="#789599" strokeWidth="1">
          <path d="M44 131l153-49 142 38-155 39z" fill="#e6edeb" />
          <path d="M44 131v9l140 28 155-39v-9M184 159v9" />
          <path d="M126 27l113 20v69l-113-23z" fill="#f4f5f2" />
          <path d="M134 36l97 17v54l-97-20z" fill="#d6e9e9" />
          <path d="M171 103v18l-22 7 54 11 20-7-40-10v-16" />
          <text
            x="147"
            y="69"
            transform="rotate(11 147 69)"
            fill="#42889a"
            stroke="none"
            fontSize="12"
            fontFamily="Consolas,monospace"
          >
            NICO OS_
          </text>
          <path d="M109 123l71 14-21 9-73-14z" fill="#f4f5f2" />
          <path d="M110 127l49 10m-57-7 48 10" />
          <path d="M265 55l37 9v63l-37-8z" fill="#e0e8e4" />
          <path d="M271 65l24 6v12l-24-6zM271 86l24 6v12l-24-6z" />
          <circle cx="291" cy="77" r="1" fill="#35a6c8" />
          <circle cx="291" cy="97" r="1" fill="#35a6c8" />
          <path d="M220 136c-10-11 5-13 10-5s-5 11-10 5z" />
          <path d="M59 47V34h13m255 23V44h-13" stroke="#35a6c8" />
        </g>
      )}
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <DigitalHero />
      <div className="page-shell">
        <section
          className={styles.organizations}
          aria-label="Organizations from Nicolas Gatta's professional experience"
        >
          <div className={styles.orgIntro}>
            PROFESSIONAL EXPERIENCE
            <span>Organizations listed in the current CV</span>
          </div>
          <div className={styles.orgNames}>
            {organizations.map((organization) => (
              <span key={organization.id} className={styles[organization.id]}>
                {organization.name}
              </span>
            ))}
          </div>
        </section>
        <section
          className={styles.section}
          id="about"
          tabIndex={-1}
          aria-labelledby="about-title"
        >
          <ConstructionGuide />
          <p className="eyebrow">01 / A SYSTEMS MINDSET</p>
          <div className={styles.aboutGrid}>
            <div>
              <h2 id="about-title" className="section-heading">
                I like understanding
                <br />
                how things connect<span className={styles.accent}>.</span>
              </h2>
              <p className={styles.aboutLead}>
                And then building something
                <br />
                that makes them work together.
              </p>
            </div>
            <div className={styles.aboutCopy}>
              <p>
                I’m Nicolas, a Data Engineer with a background in artificial
                intelligence, data analytics and software engineering.
              </p>
              <p>
                I enjoy the whole picture: turning raw data into useful
                information, connecting intelligent models to real applications,
                and building the infrastructure that keeps everything running.
              </p>
              <p>
                Outside of work, that same curiosity finds its way into my
                homelab, electronics and whatever I’m taking apart next.
              </p>
              <div className={styles.identity}>
                <span>
                  LOCATION<strong>Belgium</strong>
                </span>
                <span>
                  LANGUAGES<strong>FR / EN / NL</strong>
                </span>
                <span>
                  STATUS
                  <strong>
                    <i />
                    Building things
                  </strong>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.focusGrid}>
            {focus.map(({ id, title, detail, icon: Icon }) => (
              <div className={styles.focusItem} key={id}>
                <div>
                  <Icon size={22} strokeWidth={1.25} />
                  <span>{id}</span>
                </div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </section>
        <ExperienceTimeline />
        <section
          className={`${styles.section} ${styles.selected}`}
          id="projects"
          tabIndex={-1}
          aria-labelledby="work-title"
        >
          <ConstructionGuide />
          <div className={styles.sectionTop}>
            <p className="eyebrow">03 / SELECTED WORK</p>
            <Link to="/projects" className={styles.textLink}>
              All projects
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <h2 id="work-title" className="section-heading">
            Ideas. Engineered.
          </h2>
          <p className={styles.sectionIntro}>
            A selection of systems, experiments and things built out of
            curiosity.
          </p>
          <div className={styles.projectGrid}>
            {projects
              .filter((p) => p.featured)
              .map((project) => (
                <Link
                  to={`/projects/${project.id}`}
                  className={styles.project}
                  key={project.id}
                >
                  <div className={styles.projectImage}>
                    <div className={styles.projectLabel}>
                      PROJECT / {project.number}
                      <span>↗</span>
                    </div>
                    <ProjectVisual type={project.visual} />
                  </div>
                  <div className={styles.projectInfo}>
                    <span className={styles.projectCategory}>
                      {project.category}
                    </span>
                    <h3>
                      {project.title}
                      <ArrowUpRight size={19} />
                    </h3>
                    <p>{project.summary}</p>
                    <div className={styles.tags}>
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={styles.projectBottom}>
                      <span>{project.year}</span>
                      <span>
                        OPEN PROJECT
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <p className={styles.contentNote}>
            Project scope, technologies and status sourced from the current CV.
          </p>
        </section>
        <section
          className={styles.cvCallout}
          id="cv"
          tabIndex={-1}
          aria-labelledby="cv-heading"
        >
          <ConstructionGuide />
          <div className={styles.cvIcon}>
            <FileText size={27} strokeWidth={1.1} />
          </div>
          <div>
            <p className="eyebrow">THE PROFESSIONAL OVERVIEW</p>
            <h2 id="cv-heading">The full picture. In one place.</h2>
            <p>Experience, skills and selected work — ready when you are.</p>
          </div>
          <Link className="button button-primary" to="/cv">
            View my CV
            <ArrowUpRight size={15} />
          </Link>
        </section>
        {false && (
        <section
          className={`${styles.section} ${styles.lab}`}
          id="lab"
          tabIndex={-1}
          aria-labelledby="lab-title"
        >
          <ConstructionGuide />
          <div className={styles.sectionTop}>
            <p className="eyebrow">04 / BEYOND THE DAY JOB</p>
            <span className={styles.optional}>
              <Layers3 size={12} />
              EXPLORATION IS OPTIONAL
            </span>
          </div>
          <div className={styles.labHeading}>
            <div>
              <h2 id="lab-title" className="section-heading">
                The Lab<span className={styles.accent}>_</span>
              </h2>
              <p className={styles.sectionIntro}>
                Engineering doesn’t stop at work.
              </p>
            </div>
            <Link to="/lab" className={styles.textLink}>
              Look around
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className={styles.labGrid}>
            <Link className={styles.labCard} to="/lab/computer">
              <div className={styles.labCardTop}>
                <span>
                  <Cpu size={12} />
                  WORKSPACE / 01
                </span>
                <ArrowUpRight size={18} />
              </div>
              <LabIllustration />
              <div className={styles.labCardInfo}>
                <div>
                  <h3>A curious little computer.</h3>
                  <p>Homelab, hardware and a few hidden commands.</p>
                </div>
                <span>
                  ENTER COMPUTER
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
            <Link className={styles.labCard} to="/lab/garage">
              <div className={styles.labCardTop}>
                <span>AFTER HOURS / 02</span>
                <ArrowUpRight size={18} />
              </div>
              <LabIllustration garage />
              <div className={styles.labCardInfo}>
                <div>
                  <h3>Driven by engineering.</h3>
                  <p>A dream garage. An appreciation for what’s underneath.</p>
                </div>
                <span>
                  ENTER GARAGE
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          </div>
        </section>
        )}
        <ContactSection />
      </div>
    </>
  );
}
