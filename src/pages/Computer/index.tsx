import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Cpu,
  HardDrive,
  Monitor,
  Network,
  Power,
  Terminal,
  X,
} from 'lucide-react';
import SceneBoundary from '../../features/three/SceneBoundary';
import { DeskIllustration } from '../../features/three/Illustrations';
import styles from './Computer.module.css';

const DeskScene = lazy(() => import('../../three/scenes/DeskScene'));
type OSSection = 'PROJECTS' | 'HOMELAB' | 'ELECTRONICS' | 'SYSTEM' | 'CV' | 'ABOUT' | 'FILES';
const menu: OSSection[] = [
  'PROJECTS',
  'HOMELAB',
  'ELECTRONICS',
  'SYSTEM',
  'CV',
  'ABOUT',
  'FILES',
];

export default function Computer() {
  const [powered, setPowered] = useState(false);
  const [section, setSection] = useState<OSSection>('PROJECTS');
  const [three, setThree] = useState(false);
  const [failed, setFailed] = useState(false);
  const screenHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (powered) screenHeading.current?.focus();
  }, [powered]);
  useEffect(() => {
    if (powered && section === 'HOMELAB')
      window.dispatchEvent(
        new CustomEvent('nico:achievement', { detail: 'sysadmin' })
      );
  }, [powered, section]);
  const stopThree = () => {
    setThree(false);
    setFailed(true);
  };
  const illustration = <DeskIllustration className={styles.illustration} />;

  return (
    <div className={`page-shell ${styles.page}`}>
      <Link to="/lab" className={styles.back}>
        <ArrowLeft size={15} aria-hidden="true" /> BACK TO THE LAB
      </Link>
      <header className={styles.header}>
        <div>
          <span className="eyebrow">SERVER ROOM / PERSONAL ENVIRONMENT 001</span>
          <h1>
            Inside the system
            <br />
            to the hardware.
          </h1>
        </div>
        <p>
          Every system starts somewhere.
          <br />
          This one leads through the racks to the desk.
        </p>
      </header>
      <div className={styles.workstation}>
        <div className={styles.viewport}>
          <div className={styles.sceneLabel}>
            <span>THE WORKSTATION</span>
            <span>
              <i /> {three ? '3D VIEW' : 'BLUEPRINT VIEW'}
            </span>
          </div>
          <div className={styles.scene}>
            {three ? (
              <SceneBoundary fallback={illustration} onFailure={stopThree}>
                <Suspense
                  fallback={
                    <div className={styles.loading}>
                      BUILDING THE WORKSTATION…
                    </div>
                  }
                >
                  <DeskScene
                    focused={powered}
                    onMonitorClick={() => setPowered(true)}
                    onFailure={stopThree}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              illustration
            )}
          </div>
          <div className={styles.sceneControls}>
            <span role="status">
              {three
                ? 'Drag gently to look around · Select the monitor'
                : failed
                  ? 'Blueprint view is ready. All controls remain available.'
                  : 'An illustrated workspace. A few things to discover.'}
            </span>
            <button
              type="button"
              disabled={failed}
              title={
                failed
                  ? 'Reload the page to retry the optional 3D view.'
                  : undefined
              }
              onClick={() => setThree((value) => !value)}
            >
              <Box size={14} aria-hidden="true" />{' '}
              {failed
                ? '3D unavailable'
                : three
                  ? 'Use blueprint'
                  : 'Enable 3D'}
            </button>
          </div>
        </div>
        <section
          className={`${styles.os} ${powered ? styles.isOn : ''}`}
          aria-label="NICO OS workstation interface"
        >
          <div className={styles.osTop}>
            <span>
              <Monitor size={15} aria-hidden="true" /> NICO OS
            </span>
            <span>{powered ? 'ONLINE' : 'STANDBY'}</span>
            <button
              aria-label={powered ? 'Power off NICO OS' : 'Power on NICO OS'}
              onClick={() => setPowered((value) => !value)}
              type="button"
            >
              <Power size={16} />
            </button>
          </div>
          {powered ? (
            <>
              <div className={styles.osWelcome}>
                <span className="eyebrow">WELCOME BACK, EXPLORER</span>
                <h2 ref={screenHeading} tabIndex={-1}>
                  Make yourself at home.
                </h2>
              </div>
              <div
                className={styles.osMenu}
                role="group"
                aria-label="Workstation applications"
              >
                {menu.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={section === item}
                    onClick={() => setSection(item)}
                    className={section === item ? styles.selected : ''}
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new Event('nico:terminal'))
                  }
                >
                  TERMINAL <Terminal size={12} aria-hidden="true" />
                </button>
              </div>
              <div className={styles.osContent} key={section}>
                {section === 'PROJECTS' && (
                  <>
                    <span className={styles.directory}>~/projects</span>
                    <h3>Ideas, made tangible.</h3>
                    <p>
                      Computer vision, data platforms and tools built to solve
                      the small problems that keep coming back.
                    </p>
                    <Link to="/projects" className={styles.osLink}>
                      Browse project directory <ArrowRight size={14} />
                    </Link>
                  </>
                )}
                {section === 'HOMELAB' && (
                  <>
                    <span className={styles.directory}>~/homelab</span>
                    <h3>The infrastructure playground.</h3>
                    <p>
                      A blueprint for exploring self-hosting, containers,
                      storage and the networks connecting them.
                    </p>
                    <div className={styles.network}>
                      <span>
                        <Network size={18} />
                        NETWORK
                      </span>
                      <i />
                      <span>
                        <Cpu size={18} />
                        COMPUTE
                      </span>
                      <i />
                      <span>
                        <HardDrive size={18} />
                        STORAGE
                      </span>
                    </div>
                    <p className={styles.small}>
                      Concept architecture · hardware inventory coming soon.
                    </p>
                  </>
                )}
                {section === 'ELECTRONICS' && (
                  <>
                    <span className={styles.directory}>~/electronics</span>
                    <h3>Understand it. Then build it.</h3>
                    <p>
                      Electronics, small computers and a healthy appreciation
                      for good cable management.
                    </p>
                    <ul className={styles.inventory}>
                      <li>
                        <span>01</span> Workstation & peripherals
                      </li>
                      <li>
                        <span>02</span> Network-attached storage
                      </li>
                      <li>
                        <span>03</span> Single-board computers
                      </li>
                      <li>
                        <span>04</span> Sensors & prototyping
                      </li>
                    </ul>
                    <p className={styles.small}>
                      An illustrative bench, ready for real hardware notes.
                    </p>
                  </>
                )}
                {section === 'SYSTEM' && (
                  <>
                    <span className={styles.directory}>~/system</span>
                    <h3>Data, compute and storage.</h3>
                    <p>
                      A conceptual infrastructure map covering Linux, containers,
                      virtualization, monitoring and resilient backups.
                    </p>
                    <Link to="/projects" className={styles.osLink}>
                      Explore the projects <ArrowRight size={14} />
                    </Link>
                  </>
                )}
                {section === 'ABOUT' && (
                  <>
                    <span className={styles.directory}>~/identity</span>
                    <h3>Nicolas Gatta.</h3>
                    <p>
                      Data Engineer. Curious about AI, software and the
                      infrastructure underneath it all. Based in Belgium.
                    </p>
                    <Link to="/cv" className={styles.osLink}>
                      Read the professional version <ArrowRight size={14} />
                    </Link>
                  </>
                )}
                {section === 'CV' && <><span className={styles.directory}>~/professional-record</span><h3>The concise version.</h3><p>Experience, skills, selected work and languages in a recruiter-friendly format.</p><Link to="/cv" className={styles.osLink}>Open CV <ArrowRight size={14}/></Link></>}
                {section === 'FILES' && <><span className={styles.directory}>~/files</span><h3>Project directory.</h3><p>Case studies, architecture notes and technical decisions live in the standard accessible project pages.</p><Link to="/projects" className={styles.osLink}>Browse files <ArrowRight size={14}/></Link></>}
              </div>
              <div className={styles.osFooter}>
                <span>nico@workstation ~</span>
                <span>ALL SYSTEMS CURIOUS</span>
              </div>
            </>
          ) : (
            <div className={styles.offScreen}>
              <div className={styles.powerSymbol}>
                <Power size={29} />
              </div>
              <h2>Something to explore.</h2>
              <p>Turn on the workstation and see what’s inside.</p>
              <button
                type="button"
                className="button button-primary"
                onClick={() => setPowered(true)}
              >
                Start NICO OS <ArrowRight size={16} />
              </button>
              <span>NO INSTALLATION REQUIRED</span>
            </div>
          )}
        </section>
      </div>
      <div className={styles.bottom}>
        <p>
          <span>01 / WORKSTATION</span> The best way to understand a system is
          to take a closer look.
        </p>
        <Link to="/lab/garage">
          Next: the garage <ArrowRight size={15} />
        </Link>
      </div>
      {three && (
        <button
          className={styles.endScene}
          type="button"
          onClick={() => setThree(false)}
        >
          <X size={13} /> Close 3D view
        </button>
      )}
    </div>
  );
}
