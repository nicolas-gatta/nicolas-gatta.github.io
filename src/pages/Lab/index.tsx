import { lazy, Suspense, useState } from 'react';
import { ArrowLeft, ArrowRight, Box, Cpu, FlaskConical, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SceneBoundary from '../../features/three/SceneBoundary';
import { labHotspots } from '../../data/lab';
import styles from './Lab.module.css';

const LabHubScene = lazy(() => import('../../three/scenes/LabHubScene'));

export default function Lab() {
  const [failed, setFailed] = useState(false);
  return <div className={styles.page}><div className={`page-shell ${styles.shell}`}>
    <div className={styles.topline}><span className="eyebrow">EXPLORER LAYER / OPTIONAL ENVIRONMENT</span><Link to="/"><ArrowLeft size={14}/> EXIT LAB</Link></div>
    <header className={styles.header}><div><span className="eyebrow">ENGINEERING DOESN’T STOP AT WORK</span><h1>The Lab<span>.</span></h1></div><p>A spatial home for infrastructure, electronics and mechanical curiosity. Professional information remains available outside this environment.</p></header>
    <section className={styles.hub} aria-labelledby="hub-title"><div className={styles.hubLabel}><span id="hub-title">LAB HUB / CORRIDOR 01</span><span><i/> {failed?'STATIC ACCESS':'LIVE 3D'}</span></div><div className={styles.scene}>
      {failed?<div className={styles.fallback}><Box size={28}/><p>The spatial view is unavailable. Both destinations remain accessible below.</p></div>:<SceneBoundary fallback={<div className={styles.fallback}>Spatial view unavailable.</div>} onFailure={()=>setFailed(true)}><Suspense fallback={<div className={styles.fallback}>CONSTRUCTING LAB CORRIDOR…</div>}><LabHubScene onFailure={()=>setFailed(true)}/></Suspense></SceneBoundary>}
      <div className={styles.directionLeft}>← SERVER ROOM</div><div className={styles.directionRight}>GARAGE →</div></div>
      <div className={styles.destinations}><Link to="/lab/server-room"><Cpu size={19}/><span><small>LEFT / INFRASTRUCTURE</small>Enter server room</span><ArrowRight/></Link><Link to="/lab/garage"><Settings2 size={19}/><span><small>RIGHT / MECHANICAL</small>Enter dream garage</span><ArrowRight/></Link></div>
    </section>
    <section className={styles.hotspots} aria-labelledby="hotspots-title"><div><FlaskConical size={18}/><span id="hotspots-title">SYSTEM HOTSPOTS</span></div>{labHotspots.map(h=><article key={h.id}><span>{h.label}</span><p>{h.description}</p><small>{h.topics.join(' · ')}</small></article>)}</section>
  </div></div>;
}
