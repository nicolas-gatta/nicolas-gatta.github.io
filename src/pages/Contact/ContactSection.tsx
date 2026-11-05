import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { profile } from '../../data/profile';
import ConstructionGuide from '../../components/animations/ConstructionGuide';
import styles from './Contact.module.css';

export default function ContactSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  };
  const Heading = standalone ? 'h1' : 'h2';
  return (
    <section
      className={`${styles.contact} ${standalone ? styles.standalone : ''}`}
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
    >
      {!standalone && <ConstructionGuide />}
      <p className="eyebrow">
        {standalone ? 'START A CONVERSATION' : '05 / NEXT CONNECTION'}
      </p>
      <div className={styles.heading}>
        <Heading id="contact-title">
          LET’S BUILD
          <br />
          SOMETHING<span>.</span>
        </Heading>
        <span className={styles.symbol} aria-hidden="true">
          ↗
        </span>
      </div>
      <div className={styles.body}>
        <p>
          Have an interesting challenge, a project in mind,
          <br className={styles.desktopBreak} /> or just something worth talking
          about?
          <br />
          <strong>I’d like to hear from you.</strong>
        </p>
        <div className={styles.emailBlock}>
          <a href={`mailto:${profile.email}`} className={styles.email}>
            {profile.email}
            <ArrowUpRight size={22} />
          </a>
          <div className={styles.copyRow}>
            <button
              onClick={copy}
              aria-label={copied ? 'Email copied' : 'Copy email address'}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}{' '}
              {copied ? 'Email copied' : 'Copy email'}
            </button>
            <span role="status">
              {copyFailed
                ? 'Select and copy the email address above.'
                : copied
                  ? 'Ready for your next connection.'
                  : ''}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.channels}>
        <a href={`mailto:${profile.email}`}>
          <Mail size={16} />
          <span>Email</span>
          <ArrowUpRight size={13} />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          <ExternalLink size={15} />
          <span>LinkedIn</span>
          <ArrowUpRight size={13} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Code2 size={16} />
          <span>GitHub</span>
          <ArrowUpRight size={13} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <span className={styles.based}>BELGIUM · OPEN TO CONVERSATION</span>
      </div>
    </section>
  );
}
