import { lazy, Suspense, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Settings2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cars } from '../../data/cars';
import { CarIllustration } from '../../features/three/Illustrations';
import SceneBoundary from '../../features/three/SceneBoundary';
import styles from './Garage.module.css';

const GarageScene = lazy(() => import('../../three/scenes/GarageScene'));

export default function Garage() {
  const [index, setIndex] = useState(0);
  const [three, setThree] = useState(false);
  const [failed, setFailed] = useState(false);
  const car = cars[index];
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('nico:achievement', { detail: 'petrolhead' })
    );
  }, []);
  const change = (step: number) =>
    setIndex((current) => (current + step + cars.length) % cars.length);
  const stopThree = () => {
    setThree(false);
    setFailed(true);
  };
  const illustration = (
    <CarIllustration
      color={car.color}
      sedan={car.body === 'sedan'}
      className={styles.illustration}
    />
  );

  return (
    <div className={`page-shell ${styles.page}`}>
      <Link to="/lab" className={styles.back}>
        <ArrowLeft size={15} aria-hidden="true" /> BACK TO THE LAB
      </Link>
      <header className={styles.header}>
        <div>
          <span className="eyebrow">
            A COLLECTION OF ENGINEERING CURIOSITIES
          </span>
          <h1>
            Dream garage<span>.</span>
          </h1>
        </div>
        <p>
          Different machines.
          <br />
          The same curiosity.
        </p>
      </header>
      <div className={styles.garage}>
        <div className={styles.viewport}>
          <div className={styles.sceneHeader}>
            <span>
              <Settings2 size={14} aria-hidden="true" /> ENGINEERING STUDY
            </span>
            <span>BAY / {String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className={styles.scene}>
            {three ? (
              <SceneBoundary fallback={illustration} onFailure={stopThree}>
                <Suspense
                  fallback={
                    <div className={styles.loading}>PREPARING THE GARAGE…</div>
                  }
                >
                  <GarageScene
                    selected={index}
                    onSelect={setIndex}
                    onFailure={stopThree}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              illustration
            )}
          </div>
          <div className={styles.sceneFooter}>
            <span role="status">
              {failed
                ? 'ILLUSTRATED VIEW · ALL SPECS AVAILABLE'
                : three
                  ? 'DRAG GENTLY TO EXPLORE'
                  : 'ILLUSTRATED CONCEPT · PLACEHOLDER ASSET'}
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
                  ? 'Illustrated view'
                  : 'Enable 3D'}
            </button>
          </div>
        </div>
        <section
          className={styles.specification}
          aria-label="Selected vehicle engineering notes"
        >
          <div className={styles.specTop}>
            <span>SELECTED VEHICLE</span>
            <span>
              {String(index + 1).padStart(2, '0')} /{' '}
              {String(cars.length).padStart(2, '0')}
            </span>
          </div>
          <div className={styles.carTitle} aria-live="polite">
            <span>{car.generation}</span>
            <h2>{car.name}</h2>
          </div>
          <dl className={styles.specs}>
            <div>
              <dt>ENGINE</dt>
              <dd>{car.engine}</dd>
            </div>
            <div>
              <dt>LAYOUT</dt>
              <dd>{car.layout}</dd>
            </div>
          </dl>
          <div className={styles.engineering}>
            <h3>WHY IT’S INTERESTING</h3>
            <p>{car.engineering}</p>
            <a href={car.source.url} target="_blank" rel="noreferrer">
              {car.source.label} <ExternalLink size={11} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              aria-label="Select previous vehicle"
              onClick={() => change(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span>EXPLORE THE COLLECTION</span>
            <button
              type="button"
              aria-label="Select next vehicle"
              onClick={() => change(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </div>
      <div
        className={styles.bays}
        role="group"
        aria-label="Choose a garage vehicle"
        onKeyDown={(event) => {
          if (
            event.ctrlKey ||
            event.altKey ||
            event.metaKey ||
            !(event.target instanceof HTMLButtonElement)
          )
            return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            const next =
              (index + (event.key === 'ArrowLeft' ? -1 : 1) + cars.length) %
              cars.length;
            setIndex(next);
            event.currentTarget
              .querySelectorAll<HTMLButtonElement>('button')
              [next]?.focus();
          }
        }}
      >
        {cars.map((vehicle, vehicleIndex) => (
          <button
            key={vehicle.id}
            type="button"
            className={vehicleIndex === index ? styles.activeBay : ''}
            aria-pressed={vehicleIndex === index}
            onClick={() => setIndex(vehicleIndex)}
          >
            <span className={styles.bayNumber}>0{vehicleIndex + 1}</span>
            <span className={styles.bayName}>
              {vehicle.name}
              <small>{vehicle.generation.split(' · ')[0]}</small>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        ))}
      </div>
      <section className={styles.perspective}>
        <div>
          <span className="eyebrow">AN ENGINEER’S PERSPECTIVE</span>
          <h2>More than a silhouette.</h2>
          <p>{car.perspective}</p>
          <span className={styles.caption}>
            Curated engineering reflections · personal notes to come.
          </span>
        </div>
        <div className={styles.ratings}>
          {car.ratings.map((rating) => (
            <div key={rating.label}>
              <div className={styles.ratingLabel}>
                <span>{rating.label}</span>
                <span>{rating.value} / 10</span>
              </div>
              <div
                className={styles.ratingTrack}
                role="meter"
                aria-label={rating.label}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={rating.value}
              >
                <span style={{ width: `${rating.value * 10}%` }} />
              </div>
            </div>
          ))}
          <p>
            Illustrative interest scores, not performance or reliability
            ratings.
          </p>
        </div>
      </section>
    </div>
  );
}
