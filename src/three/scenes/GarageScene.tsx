import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { cars } from '../../data/cars';
import { ContextGuard, useSceneVisibility } from '../../features/three/useSceneVisibility';
import { useRenderTier } from '../../features/three/useRenderTier';

function Vehicle({ index, selected, onSelect }: { index:number; selected:boolean; onSelect:()=>void }) {
  const car=cars[index]; const x=(index-2)*3.4;
  return <group position={[x,0.35,0]} scale={selected?1.05:0.88} onClick={e=>{e.stopPropagation();onSelect()}}>
    <mesh position={[0,.35,0]}><boxGeometry args={[2.8,.5,1.35]}/><meshStandardMaterial color={car.color} metalness={.35} roughness={.38}/></mesh>
    <mesh position={[.1,.78,0]}><boxGeometry args={[1.45,.48,1.18]}/><meshStandardMaterial color="#173746" metalness={.2} roughness={.3}/></mesh>
    {[-.88,.88].flatMap((wheelX)=>[-.72,.72].map((z)=><mesh key={`${wheelX}-${z}`} position={[wheelX,.12,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.3,.3,.17,16]}/><meshStandardMaterial color="#070b0e" roughness={.8}/></mesh>))}
    <mesh position={[0,.02,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.2,2]}/><meshBasicMaterial color={selected?'#163d48':'#10181e'}/></mesh>
    {selected&&<pointLight position={[0,2,1]} color="#42c7e8" intensity={4} distance={4}/>}
  </group>;
}

function CameraRig({ selected }:{selected:number}) {
  const {camera,invalidate}=useThree(); const target=useRef(new Vector3()); const active=useRef(true);
  useEffect(()=>{active.current=true;invalidate()},[selected,invalidate]);
  useFrame((_,delta)=>{if(!active.current)return; const x=(selected-2)*3.4; const wanted=new Vector3(x-5,3.2,6.5); const step=1-Math.exp(-delta*4); camera.position.lerp(wanted,step); target.current.lerp(new Vector3(x,.55,0),step); camera.lookAt(target.current); if(camera.position.distanceTo(wanted)<.02)active.current=false; else invalidate()});
  return <OrbitControls enablePan={false} minDistance={5} maxDistance={8} target={[(selected-2)*3.4,.55,0]} minPolarAngle={.86} maxPolarAngle={1.34} minAzimuthAngle={-.9} maxAzimuthAngle={-.2}/>;
}

function Room({selected,onSelect}:{selected:number;onSelect:(i:number)=>void}) {
  return <group><mesh position={[0,-.08,0]}><boxGeometry args={[19,.15,9]}/><meshStandardMaterial color="#11171b" roughness={.72} metalness={.1}/></mesh><gridHelper args={[20,40,'#284a58','#1b2c34']} position={[0,.01,0]}/>
    {[-8.5,8.5].map(x=><mesh key={x} position={[x,2,-2]}><boxGeometry args={[.4,4,5]}/><meshStandardMaterial color="#171e24"/></mesh>)}
    {cars.map((_,i)=><Vehicle key={i} index={i} selected={i===selected} onSelect={()=>onSelect(i)}/>)}
    <mesh position={[0,3.4,-3.7]}><boxGeometry args={[18,.12,.12]}/><meshBasicMaterial color="#d7e9ed"/></mesh>
  </group>;
}

export default function GarageScene({selected,onSelect,onFailure}:{selected:number;onSelect:(i:number)=>void;onFailure:()=>void}) {
  const visible=useSceneVisibility(); const tier=useRenderTier();
  return <Canvas role="img" aria-label="A three-dimensional garage containing five concept vehicles in separate bays. Select a vehicle in the scene or use the accessible bay controls below." camera={{position:[-11,3.2,6.5],fov:43}} dpr={tier==='high'?[1,1.5]:tier==='medium'?[1,1.25]:1} frameloop={visible?'demand':'never'} gl={{antialias:tier!=='low',alpha:true,powerPreference:'low-power'}} style={{position:'absolute',inset:0}}>
    <ambientLight intensity={.45}/><directionalLight position={[0,7,4]} color="#e9f4f6" intensity={2.2}/><pointLight position={[0,3,2]} color="#f0b56a" intensity={3} distance={9}/><Room selected={selected} onSelect={onSelect}/><CameraRig selected={selected}/><ContextGuard onFailure={onFailure}/>
  </Canvas>;
}
