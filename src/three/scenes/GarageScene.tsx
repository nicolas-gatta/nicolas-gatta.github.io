import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import {
  ContextGuard,
  useSceneVisibility,
} from '../../features/three/useSceneVisibility';

type GarageProps = {
  color: string;
  body: 'coupe' | 'sedan' | 'grand-tourer';
  onFailure: () => void;
};

function ConceptVehicle({ color, body }: Omit<GarageProps, 'onFailure'>) {
  const sedan = body === 'sedan';
  const length = body === 'grand-tourer' ? 4.6 : 4.3;
  return (
    <group position={[0, 0.42, 0]} rotation={[0, -0.15, 0]}>
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[length, 0.55, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.25} roughness={0.4} />
      </mesh>
      <mesh position={[-0.3, 0.64, 0]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[length * 0.8, 0.22, 1.7]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.94, 0]}>
        <boxGeometry args={[sedan ? 2.3 : 1.85, 0.63, 1.52]} />
        <meshStandardMaterial
          color="#1b3c50"
          metalness={0.15}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.25, 1.29, 0]}>
        <boxGeometry args={[sedan ? 2.13 : 1.7, 0.09, 1.57]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[-0.85, 0.94, 0]} rotation={[0, 0, -0.47]}>
        <boxGeometry args={[0.12, 0.72, 1.53]} />
        <meshStandardMaterial color="#3f7389" metalness={0.1} roughness={0.3} />
      </mesh>
      <mesh position={[sedan ? 1.28 : 1.15, 0.94, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.13, 0.72, 1.53]} />
        <meshStandardMaterial color="#3f7389" metalness={0.1} roughness={0.3} />
      </mesh>
      {[
        [-1.35, 0.1, -0.91],
        [-1.35, 0.1, 0.91],
        [1.33, 0.1, -0.91],
        [1.33, 0.1, 0.91],
      ].map((position, i) => (
        <group
          key={i}
          position={position as [number, number, number]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <mesh>
            <cylinderGeometry args={[0.43, 0.43, 0.22, 18]} />
            <meshStandardMaterial color="#0b151e" roughness={0.85} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.27, 0.27, 0.235, 10]} />
            <meshStandardMaterial
              color="#698999"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 0.25, 8]} />
            <meshStandardMaterial
              color="#2c4c5c"
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[-length / 2 - 0.01, 0.39, 0]}>
        <boxGeometry args={[0.05, 0.17, 1.5]} />
        <meshStandardMaterial
          color="#afd9e6"
          emissive="#afd9e6"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-length / 2 - 0.045, 0.15, 0]}>
        <boxGeometry args={[0.06, 0.14, 1.6]} />
        <meshStandardMaterial color="#193544" roughness={0.7} />
      </mesh>
      <mesh position={[length / 2 + 0.02, 0.39, 0]}>
        <boxGeometry args={[0.05, 0.15, 1.45]} />
        <meshStandardMaterial color="#915a59" roughness={0.5} />
      </mesh>
      <mesh position={[length / 2 - 0.35, 0.81, 0]}>
        <boxGeometry args={[0.28, 0.09, 1.93]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
      </mesh>
      {[0.6, -0.6].map((z, i) => (
        <mesh key={i} position={[length / 2 - 0.35, 0.68, z]}>
          <boxGeometry args={[0.07, 0.23, 0.07]} />
          <meshStandardMaterial color="#3d6273" roughness={0.6} />
        </mesh>
      ))}
      {[0.97, -0.97].map((z, i) => (
        <mesh key={i} position={[-0.64, 0.87, z]}>
          <boxGeometry args={[0.23, 0.16, 0.18]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function GarageScene({ color, body, onFailure }: GarageProps) {
  const visible = useSceneVisibility();
  const reducedMotion = !!useReducedMotion();
  return (
    <Canvas
      role="img"
      aria-label="Three-dimensional concept car, using illustrative placeholder geometry. Engineering information is in the adjacent vehicle panel."
      camera={{ position: [-6, 3.8, 6], fov: 37 }}
      dpr={[1, 1.5]}
      frameloop={visible ? 'demand' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0 }}
      fallback={<p>3D is unavailable. Choose illustrated view to continue.</p>}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[-4, 7, 5]} color="#c4ebf4" intensity={2.3} />
      <hemisphereLight args={['#b9e8f5', '#08121b', 0.8]} />
      <ConceptVehicle color={color} body={body} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <circleGeometry args={[4.1, 64]} />
        <meshStandardMaterial color="#0b1720" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[3.4, 3.42, 96]} />
        <meshBasicMaterial color="#315d6e" />
      </mesh>
      <gridHelper
        args={[12, 24, '#284d5e', '#17313d']}
        position={[0, -0.015, 0]}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        target={[0, 0.8, 0]}
        minPolarAngle={0.85}
        maxPolarAngle={1.32}
        minAzimuthAngle={-1.08}
        maxAzimuthAngle={-0.25}
        enableDamping={!reducedMotion}
        dampingFactor={0.1}
      />
      <ContextGuard onFailure={onFailure} />
    </Canvas>
  );
}
