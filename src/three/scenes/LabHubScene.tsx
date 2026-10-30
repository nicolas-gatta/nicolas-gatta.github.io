import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { ContextGuard, useSceneVisibility } from '../../features/three/useSceneVisibility';
import { useRenderTier } from '../../features/three/useRenderTier';

function Corridor() {
  const racks = [-5.2, -3.5, -1.8, 1.8, 3.5, 5.2];
  return (
    <group>
      <mesh position={[0, -0.08, -1]}>
        <boxGeometry args={[14, 0.16, 11]} />
        <meshStandardMaterial color="#10181e" roughness={0.86} />
      </mesh>
      <gridHelper args={[14, 28, '#2d8195', '#1b313a']} position={[0, 0.01, -1]} />
      {racks.map((x) => (
        <group key={x} position={[x, 1.45, -2.5]}>
          <mesh><boxGeometry args={[1.15, 2.9, 1.2]} /><meshStandardMaterial color="#151f26" roughness={0.72} /></mesh>
          {[0.55, 0.15, -0.25, -0.65].map((y, index) => (
            <mesh key={y} position={[0, y, 0.615]}>
              <boxGeometry args={[0.86, 0.2, 0.03]} />
              <meshStandardMaterial color={index % 2 ? '#24343c' : '#1d2a31'} emissive="#163d48" emissiveIntensity={0.28} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[-3.8, 2.35, 1.5]} rotation={[0, 0.55, 0]}>
        <boxGeometry args={[3.2, 0.08, 0.08]} /><meshBasicMaterial color="#42c7e8" />
      </mesh>
      <mesh position={[3.8, 2.35, 1.5]} rotation={[0, -0.55, 0]}>
        <boxGeometry args={[3.2, 0.08, 0.08]} /><meshBasicMaterial color="#d68a3a" />
      </mesh>
      <mesh position={[-3.5, 1.55, 2.3]}><boxGeometry args={[4.5, 3.1, 0.25]} /><meshStandardMaterial color="#17242b" /></mesh>
      <mesh position={[3.5, 1.55, 2.3]}><boxGeometry args={[4.5, 3.1, 0.25]} /><meshStandardMaterial color="#211d19" /></mesh>
    </group>
  );
}

export default function LabHubScene({ onFailure }: { onFailure: () => void }) {
  const visible = useSceneVisibility();
  const reduced = !!useReducedMotion();
  const tier = useRenderTier();
  return (
    <Canvas
      role="img"
      aria-label="A spatial industrial Lab corridor. The server room branches left and the dream garage branches right; matching links follow the scene."
      camera={{ position: [0, 3.4, 8.8], fov: 43 }}
      dpr={tier === 'high' ? [1, 1.5] : tier === 'medium' ? [1, 1.25] : 1}
      frameloop={visible ? 'demand' : 'never'}
      gl={{ antialias: tier !== 'low', alpha: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.32} />
      <pointLight position={[-4, 3.5, 1]} color="#42c7e8" intensity={8} distance={9} />
      <pointLight position={[4, 3.2, 1]} color="#f0b56a" intensity={5} distance={8} />
      <Corridor />
      <OrbitControls enablePan={false} enableZoom={false} target={[0, 1.2, -1]} minAzimuthAngle={-0.42} maxAzimuthAngle={0.42} minPolarAngle={1.02} maxPolarAngle={1.38} enableDamping={!reduced} />
      <ContextGuard onFailure={onFailure} />
    </Canvas>
  );
}
