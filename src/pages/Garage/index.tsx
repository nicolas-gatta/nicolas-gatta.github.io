import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Expand, Info, Maximize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { garageAssets, garageCars } from '../../data/garageAssets';
import SceneBoundary from '../../features/three/SceneBoundary';
import styles from './Garage.module.css';

const GarageScene = lazy(() => import('../../three/scenes/GarageScene'));

export default function Garage() {
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const reducedMotion = !!useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const filmstrip = useRef<HTMLDivElement>(null);
  const closeDetails = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const car = garageCars[index];
  const asset = garageAssets[car.id];
  const onReady = useCallback(() => { setProgress(100); setReady(true); }, []);
  const onFailure = useCallback(() => { setFailed(true); setReady(true); }, []);
  const choose = useCallback((next: number) => {
    setIndex((next + garageCars.length) % garageCars.length);
    setOverview(false);
  }, []);
  const inspect = useCallback((next: number) => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    choose(next);
    setCreditsOpen(false);
    setDetailsOpen(true);
  }, [choose]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('nico:achievement', { detail: 'petrolhead' }));
  }, []);
  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === stage.current);
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);
  useEffect(() => {
    const strip = filmstrip.current;
    const selected = strip?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!strip || !selected) return;
    strip.scrollTo({ left: selected.offsetLeft - strip.offsetLeft - (strip.clientWidth - selected.offsetWidth) / 2, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [index, reducedMotion]);
  useEffect(() => {
    if (!detailsOpen) return;
    closeDetails.current?.focus({ preventScroll: true });
    return () => { if (previousFocus.current?.isConnected) previousFocus.current.focus({ preventScroll: true }); };
  }, [detailsOpen]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setDetailsOpen(false); setCreditsOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const photoFallback = <div className={styles.photoMode}>
    <img src={asset.photo} alt={`${car.name} photographed in real life`} />
    <p>Explore the collection in photo mode. The 3D view isn’t available on this device.</p>
  </div>;

  return (
    <section ref={stage} className={styles.garage} aria-label="Dream garage" data-testid="garage" data-ready={ready} data-selected={car.id} data-mode={failed ? 'photo' : '3d'}>
      <div className={styles.scene}>
        {failed ? photoFallback : <SceneBoundary fallback={photoFallback} onFailure={onFailure}>
          <Suspense fallback={null}>
            <GarageScene selected={index} overview={overview} reducedMotion={reducedMotion} onInspect={inspect} onFailure={onFailure} onReady={onReady} onProgress={setProgress} />
          </Suspense>
        </SceneBoundary>}
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <header className={styles.header}>
        <div><p>AFTER HOURS / MOTOR WORKS</p><h1>Dream garage<span>.</span></h1></div>
        <div className={styles.viewControls}>
          <button type="button" aria-pressed={overview} onClick={() => { setDetailsOpen(false); setOverview((current) => !current); }}>
            <Maximize2 size={15} aria-hidden="true" /><span>Workshop view</span>
          </button>
          {document.fullscreenEnabled && <button type="button" aria-label={fullscreen ? 'Exit fullscreen garage' : 'Enter fullscreen garage'} onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
            else void stage.current?.requestFullscreen().catch(() => {});
          }}><Expand size={16} aria-hidden="true" /></button>}
        </div>
      </header>
      <div className={styles.selection}>
        <div className={styles.bayLabel}><i />BAY 0{index + 2}<span>JAPANESE CLASSICS / {garageCars.length} CARS</span></div>
        <p className={styles.generation}>{car.generation}</p>
        <h2>{car.name}</h2>
        <p className={styles.engine}>{car.engine}</p>
        <div className={styles.vehicleControls}>
          <button type="button" aria-label="Select previous vehicle" onClick={() => choose(index - 1)}><ChevronLeft size={19} /></button>
          <button type="button" className={styles.inspect} onClick={() => inspect(index)}><Info size={15} aria-hidden="true" />Inspect car</button>
          <button type="button" aria-label="Select next vehicle" onClick={() => choose(index + 1)}><ChevronRight size={19} /></button>
        </div>
      </div>
      <div ref={filmstrip} className={styles.filmstrip} role="group" aria-label="Choose a garage vehicle" onKeyDown={(event) => {
        if (!(event.target instanceof HTMLButtonElement) || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          const next = (index + (event.key === 'ArrowLeft' ? -1 : 1) + garageCars.length) % garageCars.length;
          choose(next);
          filmstrip.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus({ preventScroll: true });
        }
      }}>
        {garageCars.map((vehicle, vehicleIndex) => <button key={vehicle.id} type="button" aria-label={`Select ${vehicle.name}`} aria-pressed={vehicleIndex === index} onClick={() => choose(vehicleIndex)}>
          <span className={styles.thumbnail}><img src={garageAssets[vehicle.id].photo} alt="" draggable="false" /></span>
          <span className={styles.vehicleName}><span>0{vehicleIndex + 1}</span><strong>{vehicle.name}</strong><small>{vehicle.generation.split(' · ')[0]}</small></span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>)}
      </div>
      <div className={styles.stageFooter}>
        <p>{failed ? 'PHOTO VIEW' : 'Choose a car · Drag to look around · Click a car or its screen'}</p>
        <button type="button" aria-expanded={creditsOpen} onClick={() => { setCreditsOpen((current) => !current); setDetailsOpen(false); }}>Model & photo credits</button>
      </div>
      <Link className={styles.fullscreenBack} to="/"><ArrowLeft size={16} aria-hidden="true" />Back to home</Link>
      {detailsOpen && <aside className={styles.details} role="region" aria-label={`${car.name} details`}>
        <div className={styles.panelTop}><span>VEHICLE FILE / 0{index + 1}</span><button ref={closeDetails} type="button" aria-label="Close vehicle details" onClick={() => setDetailsOpen(false)}><X size={18} /></button></div>
        <img className={styles.referencePhoto} src={asset.photo} alt={`${car.name}: real-life reference photograph`} />
        <div className={styles.detailsBody}>
          <p>{car.generation}</p><h2>{car.name}</h2>
          <dl><div><dt>Engine</dt><dd>{car.engine}</dd></div><div><dt>Layout</dt><dd>{car.layout}</dd></div></dl>
          <h3>What makes it interesting</h3><p>{car.engineering}</p>
          <a href={car.source.url} target="_blank" rel="noopener noreferrer">Read the story <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </aside>}
      {creditsOpen && <aside className={styles.credits} role="region" aria-label="Garage asset credits">
        <div className={styles.panelTop}><span>THE PEOPLE BEHIND THE ASSETS</span><button type="button" aria-label="Close asset credits" onClick={() => setCreditsOpen(false)}><X size={18} /></button></div>
        <div className={styles.creditBody}>
          {garageCars.map((vehicle) => {
            const credits = garageAssets[vehicle.id];
            return <div key={vehicle.id}><h3>{vehicle.name}</h3>
              <p>3D model: <a href={credits.modelCredit.source} target="_blank" rel="noopener noreferrer">{credits.modelCredit.author}</a> · <a href={credits.modelCredit.licenseUrl} target="_blank" rel="noopener noreferrer">{credits.modelCredit.license}</a></p>
              <p>Photo: <a href={credits.photoCredit.source} target="_blank" rel="noopener noreferrer">{credits.photoCredit.author}</a> · <a href={credits.photoCredit.licenseUrl} target="_blank" rel="noopener noreferrer">{credits.photoCredit.license}</a></p>
            </div>;
          })}
          <div><h3>Workshop materials</h3><p><a href="https://polyhaven.com/a/garage_floor" target="_blank" rel="noopener noreferrer">Garage Floor — Jenelle van Heerden</a><br /><a href="https://polyhaven.com/a/painted_worn_brick" target="_blank" rel="noopener noreferrer">Painted Worn Brick — Dimitrios Savva</a><br /><a href="https://polyhaven.com/license" target="_blank" rel="noopener noreferrer">Poly Haven · CC0</a></p></div>
          <p>Models optimized for the web, scaled and positioned for this workshop, with paint reflections adjusted for its lighting. Photos fitted to the diagnostic displays. Original assets and licenses linked above.</p>
        </div>
      </aside>}
      <div className={styles.door} data-open={ready} aria-hidden={ready}>
        <div className={styles.doorLabel} role="status"><span>AFTER HOURS MOTOR WORKS</span><strong>{ready ? 'Come on in.' : 'Opening the garage'}</strong><div className={styles.loadTrack}><i style={{ width: `${progress}%` }} /></div><p>{ready ? 'Welcome to the workshop.' : `Preparing the cars and workshop · ${Math.round(progress)}%`}</p></div>
      </div>
    </section>
  );
}
