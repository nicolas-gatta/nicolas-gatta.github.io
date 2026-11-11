import { ArrowUpRight } from 'lucide-react';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './GarageEntrance.module.css';

const GarageEntrance = forwardRef<HTMLAnchorElement>(function GarageEntrance(_props, ref) {
  return <Link ref={ref} to="/garage" className={styles.entrance} aria-label="Love car ? Click here — open my garage" data-testid="garage-entrance">
    <svg viewBox="0 0 300 205" fill="none" aria-hidden="true">
      <path d="M18 185 53 172h222l16 13-38 17H41Z" fill="var(--garage-shadow)" />
      <path d="M27 61 239 57v126H27Z" fill="var(--garage-wall)" stroke="var(--garage-line)" />
      <path d="m239 57 43-23v130l-43 19Z" fill="var(--garage-side)" stroke="var(--garage-line)" />
      <path d="M16 61 58 27h224l-43 30Z" fill="var(--garage-roof)" stroke="var(--garage-line)" />
      <path d="m30 52 223-3 17-12H62Z" fill="var(--garage-side)" opacity=".6" />
      <path d="M43 93h179v90H43Z" fill="#111d21" stroke="var(--garage-line)" />
      <g className={styles.shutter}>
        <path d="M45 94h175v57H45Z" fill="var(--garage-roof)" stroke="var(--garage-line)" />
        {[103, 113, 123, 133, 143].map((y) => <path key={y} d={`M47 ${y}h171`} stroke="var(--garage-line)" opacity=".6" />)}
      </g>
      <path d="m78 157 15-23h80l17 24 8 7v17H67v-17Z" fill="#35434a" stroke="#9bb5bd" strokeWidth="1.1" />
      <path d="m97 139-9 16h92l-12-16Z" fill="#14262f" stroke="#7899a4" />
      <path d="M77 164h20v6H77Zm92 0h20v6h-20Z" fill="#ecdda0" />
      <path d="M106 168h52v10h-52Z" fill="#132026" />
      <path d="M43 183h179M28 184h211" stroke="#bdc1a1" />
      <path d="m252 87 19-11v38l-19 11Z" fill="#14282f" stroke="var(--garage-line)" />
      <path d="m261 81 1 38m-10-19 19-11" stroke="var(--garage-line)" />
      <path d="M35 74v9m195-9v9" stroke="#f3cc7f" strokeWidth="3" />
    </svg>
    <span className={styles.sign}>Love car ? Click here <ArrowUpRight size={13} aria-hidden="true" /></span>
  </Link>;
});

export default GarageEntrance;
