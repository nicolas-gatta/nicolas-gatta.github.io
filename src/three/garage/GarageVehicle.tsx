import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { Box3, CanvasTexture, Group, Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, SRGBColorSpace, Vector3 } from 'three';
import { garageAssets, garageCars } from '../../data/garageAssets';

export const vehicleCenters = [-7.5, 0, 7.5];

function DiagnosticMonitor({ index, onInspect }: { index: number; onInspect: () => void }) {
  const car = garageCars[index];
  const photograph = useTexture(garageAssets[car.id].photo);
  const screen = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 640;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#101813'; ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = '#b7d0b4'; ctx.font = '22px monospace';
    ctx.fillText(`BAY 0${index + 2}  /  VEHICLE FILE`, 34, 45);
    ctx.fillStyle = '#e9eee4'; ctx.font = 'bold 35px Arial';
    ctx.fillText(car.name.toUpperCase(), 34, 99);
    const image = photograph.image as HTMLImageElement;
    const ratio = Math.min(954 / image.width, 390 / image.height);
    const w = image.width * ratio, h = image.height * ratio;
    ctx.drawImage(image, (1024 - w) / 2, 122 + (390 - h) / 2, w, h);
    ctx.fillStyle = '#b7d0b4'; ctx.font = '21px monospace';
    ctx.fillText(car.engine.split(' · ')[0], 34, 558);
    ctx.fillStyle = '#8d9d8a'; ctx.font = '18px monospace';
    ctx.fillText('REAL-WORLD REFERENCE  /  CLICK TO INSPECT', 34, 605);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [car, photograph, index]);
  useEffect(() => () => screen.dispose(), [screen]);
  return <group position={[vehicleCenters[index] + 2.65, 0, 1.35]} rotation={[0, -0.16, 0]}>
    <mesh position={[0, 0.08, 0]} castShadow><boxGeometry args={[0.9, 0.14, 0.68]} /><meshStandardMaterial color="#2d332b" metalness={0.65} roughness={0.4} /></mesh>
    <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.055, 0.07, 1.4, 12]} /><meshStandardMaterial color="#a1aaa0" metalness={0.8} roughness={0.28} /></mesh>
    <mesh position={[0, 1.62, 0]} castShadow><boxGeometry args={[1.65, 1.08, 0.12]} /><meshStandardMaterial color="#1c211b" roughness={0.65} /></mesh>
    <mesh position={[0, 1.62, 0.066]} onClick={(event) => { event.stopPropagation(); onInspect(); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
      <planeGeometry args={[1.49, 0.93]} /><meshBasicMaterial map={screen} toneMapped={false} />
    </mesh>
    <mesh position={[0, 1.1, 0.24]} rotation={[-0.18, 0, 0]}><boxGeometry args={[0.9, 0.045, 0.38]} /><meshStandardMaterial color="#242b22" roughness={0.8} /></mesh>
    {[-0.36, 0.36].flatMap((x) => [-0.26, 0.26].map((z) => <mesh key={`${x}-${z}`} position={[x, 0.055, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.075, 0.075, 0.045, 10]} /><meshStandardMaterial color="#121610" /></mesh>))}
  </group>;
}

export default function GarageVehicle({ index, onInspect }: { index: number; onInspect: () => void }) {
  const car = garageCars[index];
  const asset = garageAssets[car.id];
  const { scene } = useGLTF(asset.model);
  const { model, paint } = useMemo(() => {
    const root = new Group();
    const copy = scene.clone(true);
    copy.rotation.y += asset.yaw;
    root.add(copy);
    root.updateMatrixWorld(true);
    const box = new Box3().setFromObject(root, true);
    const size = box.getSize(new Vector3());
    root.scale.setScalar(4.5 / Math.max(size.x, size.z));
    root.updateMatrixWorld(true);
    box.setFromObject(root, true);
    const center = box.getCenter(new Vector3());
    root.position.set(-center.x, -box.min.y + 0.015, -center.z);
    const tuned = new Map<Material, MeshStandardMaterial>();
    const tunePaint = (original: Material) => {
      if (original.name !== asset.paintMaterial || !(original instanceof MeshStandardMaterial)) return original;
      let material = tuned.get(original);
      if (!material) {
        material = original.clone();
        material.roughness = 0.3;
        material.metalness = 0.6;
        material.envMapIntensity = 1.2;
        if (material instanceof MeshPhysicalMaterial) { material.clearcoat = 1; material.clearcoatRoughness = 0.08; }
        tuned.set(original, material);
      }
      return material;
    };
    root.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material = Array.isArray(object.material) ? object.material.map(tunePaint) : tunePaint(object.material);
      }
    });
    return { model: root, paint: [...tuned.values()] };
  }, [scene, asset]);
  useEffect(() => () => { paint.forEach((material) => material.dispose()); document.body.style.cursor = ''; }, [paint]);
  return <group>
    <group position={[vehicleCenters[index], 0, 0]} onClick={(event) => { event.stopPropagation(); onInspect(); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
      <primitive object={model} />
    </group>
    <DiagnosticMonitor index={index} onInspect={onInspect} />
  </group>;
}
