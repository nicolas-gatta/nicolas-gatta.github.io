import { useEffect, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, Vector2 } from 'three';

export const bayCenters = [-15, -7.5, 0, 7.5, 15];
const floorNormalScale = new Vector2(0.45, 0.45);
const wallNormalScale = new Vector2(0.65, 0.65);
type V3 = [number, number, number];

function Block({ at, size, color = '#535552', metal = 0, rough = 0.75, rotation }: {
  at: V3; size: V3; color?: string; metal?: number; rough?: number; rotation?: V3;
}) {
  return <mesh position={at} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} metalness={metal} roughness={rough} />
  </mesh>;
}

function Stencil({ text, at, width = 2.2, height = 0.5 }: { text: string; at: V3; width?: number; height?: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ded7b7';
    ctx.font = 'bold 68px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 91, 490);
    return new CanvasTexture(canvas);
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={at}>
    <planeGeometry args={[width, height]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} />
  </mesh>;
}

function Tyre({ at, flat = true }: { at: V3; flat?: boolean }) {
  return <group position={at} rotation={flat ? [Math.PI / 2, 0, 0] : [0, 0, 0]}>
    <mesh castShadow><torusGeometry args={[0.31, 0.12, 10, 28]} /><meshStandardMaterial color="#171917" roughness={0.95} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.24, 0.24, 0.19, 20]} /><meshStandardMaterial color="#555753" metalness={0.85} roughness={0.32} /></mesh>
  </group>;
}

function ToolChest({ x }: { x: number }) {
  return <group position={[x, 0, -4.85]}>
    <Block at={[0, 0.65, 0]} size={[1.7, 1.05, 0.65]} color="#842f28" metal={0.45} rough={0.42} />
    <Block at={[0, 1.22, 0]} size={[1.8, 0.1, 0.75]} color="#b3a68a" rough={0.65} />
    {[0, 1, 2, 3, 4].map((index) => <group key={index}>
      <Block at={[0, 0.29 + index * 0.18, 0.337]} size={[1.53, 0.145, 0.035]} color="#6b2421" metal={0.35} />
      <Block at={[0, 0.34 + index * 0.18, 0.369]} size={[1.25, 0.025, 0.035]} color="#b4b7b1" metal={0.9} rough={0.25} />
    </group>)}
    {[-0.65, 0.65].flatMap((side) => [-0.23, 0.23].map((z) =>
      <mesh key={`${side}-${z}`} position={[side, 0.11, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} /><meshStandardMaterial color="#151714" roughness={0.9} />
      </mesh>))}
    <Block at={[0, 2.15, -0.1]} size={[1.85, 1.4, 0.08]} color="#55584f" metal={0.45} />
    {[-0.65, -0.33, 0, 0.33, 0.65].map((side, index) => <group key={side} position={[side, 2.2, 0]} rotation={[0, 0, (index - 2) * 0.12]}>
      <Block at={[0, 0, 0]} size={[0.035, 0.45 + index * 0.035, 0.035]} color="#a5aaa4" metal={0.9} rough={0.26} />
      <mesh position={[0, 0.27 + index * 0.015, 0]}><torusGeometry args={[0.06, 0.018, 6, 12]} /><meshStandardMaterial color="#b4b8b1" metalness={0.9} roughness={0.25} /></mesh>
    </group>)}
    <Block at={[-0.48, 1.31, 0.03]} size={[0.25, 0.12, 0.2]} color="#384039" metal={0.6} />
    <Block at={[0.54, 1.42, 0]} size={[0.12, 0.34, 0.12]} color="#c4aa47" metal={0.25} />
  </group>;
}

function Lift({ x }: { x: number }) {
  return <group position={[x, 0, -0.6]}>
    {[-1, 1].map((side) => <group key={side}>
      <Block at={[side * 1.96, 1.85, -0.8]} size={[0.28, 3.7, 0.36]} color="#97372a" metal={0.5} rough={0.4} />
      <Block at={[side * 1.96, 0.06, -0.8]} size={[0.75, 0.12, 0.8]} color="#3b3e38" metal={0.6} />
      <Block at={[side * 1.38, 0.14, -0.18]} size={[1.45, 0.12, 0.14]} rotation={[0, side * 0.65, 0]} color="#bd9f39" metal={0.6} />
      <Block at={[side * 1.38, 0.14, -1.2]} size={[1.45, 0.12, 0.14]} rotation={[0, -side * 0.65, 0]} color="#bd9f39" metal={0.6} />
    </group>)}
    <Block at={[0, 3.8, -0.8]} size={[4.2, 0.18, 0.23]} color="#803126" metal={0.5} />
    <Block at={[-2.18, 1.3, -0.55]} size={[0.18, 0.32, 0.18]} color="#32362f" metal={0.4} />
  </group>;
}

export default function Workshop() {
  const sources = useTexture(['garage_floor', 'painted_worn_brick'].flatMap((name) =>
    ['diff', 'nor_gl', 'rough'].map((kind) => `${import.meta.env.BASE_URL}textures/garage/${name}_${kind}_1k.jpg`)));
  const maps = useMemo(() => sources.map((source, index) => {
    const map = source.clone();
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.set(index < 3 ? 8 : 26, index < 3 ? 12 : 3.55);
    map.anisotropy = 4;
    if (index % 3 === 0) map.colorSpace = SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }), [sources]);
  useEffect(() => () => maps.forEach((map) => map.dispose()), [maps]);
  const [floor, floorNormal, floorRough, wall, wallNormal, wallRough] = maps;
  return <group>
    <mesh position={[0, -0.055, 23.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[47, 60]} /><meshStandardMaterial map={floor} normalMap={floorNormal} normalScale={floorNormalScale} roughnessMap={floorRough} roughness={0.85} metalness={0.08} />
    </mesh>
    <mesh position={[0, 6.4, 23.5]}><boxGeometry args={[47, 0.18, 60]} /><meshStandardMaterial color="#686c62" roughness={0.95} /></mesh>
    <mesh position={[0, 3.2, -6.4]} receiveShadow><boxGeometry args={[47, 6.4, 0.3]} /><meshStandardMaterial map={wall} normalMap={wallNormal} normalScale={wallNormalScale} roughnessMap={wallRough} roughness={0.95} color="#b7b8ad" /></mesh>
    <Block at={[0, 0.6, -6.19]} size={[47, 1.2, 0.08]} color="#4a5048" />
    <Block at={[0, 1.23, -6.12]} size={[47, 0.055, 0.06]} color="#c8ba8e" />
    {[-23.5, 23.5].map((x) => <Block key={x} at={[x, 3.2, 23.5]} size={[0.25, 6.4, 60]} color="#74786e" />)}
    <Block at={[0, 2.45, -6.13]} size={[5.6, 4.5, 0.1]} color="#545c55" metal={0.4} />
    {Array.from({ length: 15 }, (_, index) => <Block key={index} at={[0, 0.35 + index * 0.29, -6.04]} size={[5.5, 0.018, 0.025]} color="#303a34" metal={0.55} />)}
    <Stencil text="AFTER HOURS MOTOR WORKS" at={[0, 5.8, -6.17]} width={8} height={0.65} />
    {bayCenters.map((x, index) => <group key={x}>
      <Stencil text={`BAY 0${index + 1}`} at={[x, 4.9, -6.17]} width={1.9} height={0.5} />
      {[-3.15, 3.15].map((offset) => <mesh key={offset} position={[x + offset, 0.006, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.045, 7.3]} /><meshStandardMaterial color="#b7a153" roughness={0.9} />
      </mesh>)}
      <mesh position={[x, 5.45, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[4.6, 0.4, 0.06]} /><meshStandardMaterial color="#fff1d1" emissive="#fff1d1" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[x, 4.8, 0.8]} color="#ffe6bd" intensity={30} distance={13} decay={2} />
      <ToolChest x={x - 2.2} />
      {[0, 1, 2].map((height) => <Tyre key={height} at={[x + 2.45, 0.15 + height * 0.25, -4.7]} />)}
      <Tyre at={[x + 3, 0.43, -4.6]} flat={false} />
      {index === 0 || index === 4 ? <Lift x={x} /> : null}
      <Block at={[x, 6.05, -0.5]} size={[0.12, 0.25, 11.5]} color="#4b5149" metal={0.7} />
    </group>)}
    {[-4, 0, 4].map((z) => <Block key={z} at={[0, 6.05, z]} size={[47, 0.2, 0.12]} color="#4b5149" metal={0.65} />)}
    <group position={[-13, 0, 2.8]} rotation={[0, -0.4, 0]}>
      <Block at={[0, 0.12, 0]} size={[0.32, 0.18, 0.8]} color="#a73224" metal={0.5} />
      <Block at={[0, 0.42, -0.32]} size={[0.045, 0.75, 0.045]} color="#999f97" metal={0.8} rotation={[-0.3, 0, 0]} />
      {[-0.22, 0.22].map((x) => <mesh key={x} position={[x, 0.1, 0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.08, 12]} /><meshStandardMaterial color="#242822" /></mesh>)}
    </group>
    <Block at={[21, 1.15, -5.5]} size={[1.4, 2.3, 0.7]} color="#657166" metal={0.5} rough={0.5} />
    <Block at={[21, 1.15, -5.13]} size={[0.04, 2.1, 0.04]} color="#a8ada3" metal={0.8} />
    <Block at={[-21.5, 1.1, -5.7]} size={[1.4, 2.2, 0.55]} color="#657166" metal={0.5} rough={0.5} />
  </group>;
}
