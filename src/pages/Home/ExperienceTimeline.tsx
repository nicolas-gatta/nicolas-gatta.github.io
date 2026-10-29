import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Building2, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { experiences, experienceDisclaimer } from '../../data/experience';
import ConstructionGuide from '../../components/animations/ConstructionGuide';
import styles from './Home.module.css';

export default function ExperienceTimeline() {
  const [selected, setSelected] = useState<string | null>(null);
  const experience = experiences.find((item) => item.id === selected);
  return (
    <section
      className={`${styles.section} ${styles.experience}`}
      id="experience"
      tabIndex={-1}
      aria-labelledby="experience-title"
    >
      <ConstructionGuide />
      <div className={styles.sectionTop}>
        <p className="eyebrow">02 / THE JOURNEY</p>
        <Link to="/cv" className={styles.textLink}>
          Full CV <ArrowUpRight size={15} />
        </Link>
      </div>
      <h2 id="experience-title" className="section-heading">
        Experience, connected.
      </h2>
      <p className={styles.sectionIntro}>
        Different environments. One drive to build better systems.
      </p>
      <div className={styles.timeline}>
        {experiences.map((item, index) => (
          <div className={styles.milestone} key={item.id}>
            <button
              aria-expanded={selected === item.id}
              aria-controls="experience-details"
              onClick={() => setSelected(selected === item.id ? null : item.id)}
              className={
                selected === item.id ? styles.milestoneActive : undefined
              }
            >
              <span className={styles.year}>
                {item.year}
                <span>
                  {index === experiences.length - 1
                    ? 'LATEST'
                    : `0${index + 1}`}
                </span>
              </span>
              <span className={styles.timelinePoint}>
                <i />
              </span>
              <span className={styles.company}>{item.company}</span>
              <span className={styles.timelineAction}>
                {selected === item.id ? 'Close details' : 'Explore milestone'}
                {selected === item.id ? <X size={12} /> : <Plus size={12} />}
              </span>
            </button>
          </div>
        ))}
      </div>
      <AnimatePresence initial={false}>
        {experience && (
          <motion.div
            id="experience-details"
            className={styles.experienceCard}
            key={experience.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Building2 size={25} />
            <div>
              <p className="eyebrow">
                {experience.period} /{' '}
                {experience.isPlaceholder
                  ? 'REPRESENTATIVE MILESTONE'
                  : 'EXPERIENCE'}
              </p>
              <h3>{experience.company}</h3>
              {experience.isPlaceholder ? (
                <p>
                  Roles, scope and achievements will be added with confirmed
                  career details.
                </p>
              ) : (
                <>
                  <p>
                    <strong>{experience.role}</strong>
                  </p>
                  <p>{experience.summary}</p>
                  <ul>
                    {experience.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {experience.technologies.length > 0 && (
                <div>
                  {experience.technologies.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className={styles.contentNote}>{experienceDisclaimer}</p>
    </section>
  );
}
