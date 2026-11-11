import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap, Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { garageCars } from '../../data/garageAssets';
import { ContextGuard, useSceneVisibility } from '../../features/three/useSceneVisibility';
import { useRenderTier } from '../../features/three/useRenderTier';
import Workshop from '../garage/Workshop';
import GarageVehicle, { vehicleCenters } from '../garage/GarageVehicle';

interface GarageSceneProps {
  selected: number;
  overview: boolean;
  reducedMotion: boolean;
  onInspect: (index: number) => void;
  onFailure: () => void;
  onReady: () => void;
  onProgress: (progress: number) => void;
}

function LoadingProgress({ onProgress }: { onProgress: GarageSceneProps['onProgress'] }) {
  const { progress } = useProgress();
  useEffect(() => onProgress(progress), [progress, onProgress]);
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const invalidate = useThree((state) => state.invalidate);
  useFrame(() => {
    if (++frames.current === 3) onReady();
    else if (frames.current < 3) invalidate();
  });
  return null;
}

function CameraRig({ selected, overview, reducedMotion }: Pick<GarageSceneProps, 'selected' | 'overview' | 'reducedMotion'>) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, invalidate, size } = useThree();
  const moving = useRef(true);
  const compact = size.width < 760;
  const wanted = useMemo(() => overview
    ? new Vector3(0, 4.2, compact ? 40 : 21)
    : new Vector3(vehicleCenters[selected] - (compact ? 6.8 : 5.6), compact ? 3.1 : 2.8, compact ? 11.5 : 8.2),
  [selected, overview, compact]);
  const target = useMemo(() => overview
    ? new Vector3(0, 1.3, -0.9)
    : new Vector3(vehicleCenters[selected] + 0.55, 0.85, 0.15), [selected, overview]);
  useEffect(() => { moving.current = true; invalidate(); }, [wanted, target, invalidate]);
  useFrame((_, delta) => {
    if (!moving.current || !controls.current) return;
    const step = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.08) * 4);
    camera.position.lerp(wanted, step);
    controls.current.target.lerp(target, step);
    controls.current.update();
    if (camera.position.distanceTo(wanted) < 0.015 && controls.current.target.distanceTo(target) < 0.015) moving.current = false;
    else invalidate();
  });
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping={!reducedMotion} dampingFactor={0.1} minDistance={4.5} maxDistance={overview ? 48 : 18} minPolarAngle={0.35} maxPolarAngle={Math.PI / 2 - 0.04} onStart={() => { moving.current = false; }} />;
}

export default function GarageScene(props: GarageSceneProps) {
  const visible = useSceneVisibility();
  const tier = useRenderTier();
  return <>
    <LoadingProgress onProgress={props.onProgress} />
    <Canvas role="img" aria-label="A realistic workshop with three Japanese sports cars, vehicle lifts, tools and photo diagnostic monitors. Choose a car using the controls below."
      shadows={tier !== 'low'} dpr={tier === 'high' ? [1, 1.5] : [1, 1.25]} frameloop={visible ? 'demand' : 'never'}
      camera={{ position: [-13.1, 2.8, 8.2], fov: 48, near: 0.1, far: 140 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }}
      onCreated={({ gl }) => { gl.toneMappingExposure = 1.05; gl.shadowMap.type = PCFSoftShadowMap; }}
      style={{ position: 'absolute', inset: 0 }}>
      <color attach="background" args={['#23251f']} />
      <fog attach="fog" args={['#23251f', 36, 85]} />
      <ambientLight intensity={0.35} color="#e5e1cc" />
      <hemisphereLight args={['#e8edf2', '#494336', 0.65]} />
      <directionalLight position={[-9, 12, 8]} intensity={2} color="#fff0da" castShadow={tier !== 'low'} shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-bias={-0.0003} />
      <Suspense fallback={null}>
        <Environment frames={1} resolution={256}>
          <Lightformer form="rect" intensity={4} position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[22, 5, 1]} color="#fff6e5" />
          <Lightformer form="rect" intensity={2.5} position={[-14, 3, 6]} rotation={[0, Math.PI / 4, 0]} scale={[5, 8, 1]} color="#eff3f6" />
          <Lightformer form="rect" intensity={2} position={[15, 4, -5]} rotation={[0, -Math.PI / 3, 0]} scale={[6, 6, 1]} color="#e5e5cb" />
        </Environment>
        <Workshop />
        {garageCars.map((car, index) => <GarageVehicle key={car.id} index={index} onInspect={() => props.onInspect(index)} />)}
        <ContactShadows position={[0, -0.035, 0]} frames={1} opacity={0.55} scale={32} width={32} height={16} blur={2.5} far={4.5} resolution={512} color="#171b13" />
        <Ready onReady={props.onReady} />
      </Suspense>
      <CameraRig selected={props.selected} overview={props.overview} reducedMotion={props.reducedMotion} />
      <ContextGuard onFailure={props.onFailure} />
    </Canvas>
  </>;
}
