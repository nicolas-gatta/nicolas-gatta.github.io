import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useCursor } from '@react-three/drei';
import { Vector3 } from 'three';
import { useReducedMotion } from 'framer-motion';
import {
  ContextGuard,
  useSceneVisibility,
} from '../../features/three/useSceneVisibility';

type DeskProps = {
  focused: boolean;
  onMonitorClick: () => void;
  onFailure: () => void;
};

function Block({
  position,
  size,
  color,
  ...rest
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} {...rest}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
}

function Workstation({
  focused,
  onMonitorClick,
}: Pick<DeskProps, 'focused' | 'onMonitorClick'>) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <group>
      <Block position={[0, 0.92, 0]} size={[6.2, 0.18, 3.1]} color="#182d38" />
      {[
        [-2.6, 0.43, -1],
        [-2.6, 0.43, 1],
        [2.6, 0.43, -1],
        [2.6, 0.43, 1],
      ].map((position, index) => (
        <Block
          key={index}
          position={position as [number, number, number]}
          size={[0.13, 0.86, 0.13]}
          color="#294550"
        />
      ))}
      <Block
        position={[0, 1.1, -0.6]}
        size={[1.2, 0.12, 0.7]}
        color="#2b4654"
      />
      <Block
        position={[0, 1.48, -0.72]}
        size={[0.22, 0.8, 0.18]}
        color="#2c4b5b"
      />
      <group
        onClick={(event) => {
          event.stopPropagation();
          onMonitorClick();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <Block
          position={[0, 2.35, -0.72]}
          size={[2.75, 1.76, 0.18]}
          color={hovered ? '#467c8c' : '#2c4756'}
        />
        <mesh position={[0, 2.37, -0.615]}>
          <planeGeometry args={[2.52, 1.48]} />
          <meshStandardMaterial
            color={focused ? '#30758c' : '#112c39'}
            emissive={focused ? '#2c758a' : '#0b1c28'}
            emissiveIntensity={focused ? 0.5 : 0.12}
            roughness={0.6}
          />
        </mesh>
        <mesh position={[0, 1.56, -0.61]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color={focused ? '#83d9e6' : '#537e8d'} />
        </mesh>
        {focused && (
          <group position={[-0.9, 2.65, -0.598]}>
            <Block
              position={[0.32, 0, 0]}
              size={[0.65, 0.055, 0.006]}
              color="#bcf1f4"
            />
            <Block
              position={[0.62, -0.16, 0]}
              size={[1.25, 0.018, 0.006]}
              color="#75b6c7"
            />
            <Block
              position={[0.42, -0.4, 0]}
              size={[0.85, 0.03, 0.006]}
              color="#8accd7"
            />
            <Block
              position={[0.3, -0.53, 0]}
              size={[0.6, 0.025, 0.006]}
              color="#6da9ba"
            />
            <Block
              position={[0.52, -0.66, 0]}
              size={[1.05, 0.025, 0.006]}
              color="#6da9ba"
            />
          </group>
        )}
      </group>
      <group position={[-0.15, 1.07, 0.73]} rotation={[-0.06, 0, 0]}>
        <Block position={[0, 0, 0]} size={[2.3, 0.12, 0.81]} color="#263e4e" />
        {Array.from({ length: 48 }, (_, i) => (
          <Block
            key={i}
            position={[
              -1.01 + (i % 12) * 0.18,
              0.076,
              -0.28 + Math.floor(i / 12) * 0.18,
            ]}
            size={[0.14, 0.035, 0.13]}
            color={i > 35 ? '#3b5c6d' : '#35505f'}
          />
        ))}
        <Block
          position={[0, 0.08, 0.28]}
          size={[0.75, 0.035, 0.13]}
          color="#466b7a"
        />
      </group>
      <mesh position={[1.7, 1.14, 0.83]} scale={[0.7, 0.45, 1]}>
        <sphereGeometry args={[0.27, 16, 12]} />
        <meshStandardMaterial color="#3e6170" roughness={0.6} />
      </mesh>
      <group position={[2.25, 1.51, -0.63]}>
        <Block position={[0, 0, 0]} size={[0.8, 1, 0.9]} color="#2c4d5a" />
        <Block
          position={[0, 0, 0.46]}
          size={[0.67, 0.84, 0.035]}
          color="#112a37"
        />
        {[0, 1, 2].map((i) => (
          <group key={i}>
            <Block
              position={[-0.025, 0.26 - i * 0.25, 0.485]}
              size={[0.52, 0.13, 0.025]}
              color="#446776"
            />
            <mesh position={[0.19, 0.26 - i * 0.25, 0.508]}>
              <sphereGeometry args={[0.018, 6, 6]} />
              <meshBasicMaterial color="#72ccdc" />
            </mesh>
          </group>
        ))}
      </group>
      <group position={[-2.15, 1.06, 0.14]}>
        <Block position={[0, 0, 0]} size={[0.7, 0.04, 0.52]} color="#23515e" />
        <Block
          position={[0.05, 0.05, 0]}
          size={[0.25, 0.06, 0.23]}
          color="#10242e"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Block
            key={i}
            position={[-0.29 + i * 0.13, 0.04, -0.2]}
            size={[0.06, 0.04, 0.04]}
            color="#73909a"
          />
        ))}
      </group>
      <Block
        position={[-2.45, 1.23, -1]}
        size={[0.35, 0.42, 0.35]}
        color="#29424a"
      />
      <mesh position={[-2.45, 1.57, -1]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.19, 0.52, 5]} />
        <meshStandardMaterial color="#426f70" />
      </mesh>
      <mesh position={[0, -0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.6, 64]} />
        <meshStandardMaterial color="#0c1720" roughness={1} />
      </mesh>
      <gridHelper
        args={[12, 24, '#2b5262', '#17323e']}
        position={[0, -0.015, 0]}
      />
    </group>
  );
}

function CameraTransition({
  focused,
  reducedMotion,
  onSettled,
  onMoving,
}: {
  focused: boolean;
  reducedMotion: boolean;
  onSettled: () => void;
  onMoving: () => void;
}) {
  const { camera, invalidate } = useThree();
  const active = useRef(false);
  const target = useRef(new Vector3(0, 1.25, 0));
  const wantedPosition = useRef(new Vector3(6, 4.2, 7));
  const wantedTarget = useRef(new Vector3(0, 1.25, 0));
  useEffect(() => {
    wantedPosition.current.set(
      ...((focused ? [0, 2.45, 3.8] : [6, 4.2, 7]) as [number, number, number])
    );
    wantedTarget.current.set(
      ...((focused ? [0, 2.35, -0.7] : [0, 1.25, 0]) as [
        number,
        number,
        number,
      ])
    );
    if (reducedMotion) {
      camera.position.copy(wantedPosition.current);
      target.current.copy(wantedTarget.current);
      camera.lookAt(target.current);
      active.current = false;
      onSettled();
      invalidate();
      return;
    }
    active.current = true;
    onMoving();
    invalidate();
  }, [focused, reducedMotion, camera, invalidate]);
  useFrame((_, delta) => {
    if (!active.current) return;
    const step = 1 - Math.exp(-Math.min(delta, 0.1) * 6);
    camera.position.lerp(wantedPosition.current, step);
    target.current.lerp(wantedTarget.current, step);
    camera.lookAt(target.current);
    if (camera.position.distanceTo(wantedPosition.current) < 0.008) {
      active.current = false;
      onSettled();
    } else invalidate();
  });
  return null;
}

export default function DeskScene({
  focused,
  onMonitorClick,
  onFailure,
}: DeskProps) {
  const visible = useSceneVisibility();
  const reducedMotion = !!useReducedMotion();
  const [moving, setMoving] = useState(false);
  return (
    <Canvas
      role="img"
      aria-label="Interactive three-dimensional workstation. Use the adjacent Start NICO OS button for the same monitor interaction."
      camera={{ position: [6, 4.2, 7], fov: 39 }}
      dpr={[1, 1.5]}
      frameloop={visible ? 'demand' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0 }}
      fallback={<p>3D is unavailable. Choose blueprint view to continue.</p>}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 5]} color="#bce9f2" intensity={2.2} />
      <hemisphereLight args={['#a9ddeb', '#08121b', 0.8]} />
      <Workstation focused={focused} onMonitorClick={onMonitorClick} />
      <CameraTransition
        focused={focused}
        reducedMotion={reducedMotion}
        onMoving={() => setMoving(true)}
        onSettled={() => setMoving(false)}
      />
      <OrbitControls
        enabled={!focused && !moving}
        enablePan={false}
        enableZoom={false}
        target={[0, 1.25, 0]}
        minPolarAngle={0.75}
        maxPolarAngle={1.25}
        minAzimuthAngle={0.35}
        maxAzimuthAngle={1.02}
        enableDamping={!reducedMotion}
        dampingFactor={0.1}
      />
      <ContextGuard onFailure={onFailure} />
    </Canvas>
  );
}
