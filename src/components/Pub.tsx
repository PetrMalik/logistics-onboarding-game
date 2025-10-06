import { useRef } from 'react'
import * as THREE from 'three'

interface PubProps {
  position: [number, number, number]
}

export function Pub({ position }: PubProps) {
  const pubRef = useRef<THREE.Group>(null)

  return (
    <group ref={pubRef} position={position}>
      {/* Základna hospody - kreslený styl */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <boxGeometry args={[6, 3.6, 4]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Střecha */}
      <mesh castShadow position={[0, 3.8, 0]}>
        <coneGeometry args={[4, 1.6, 4]} />
        <meshStandardMaterial 
          color="#654321" 
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      {/* Cedulka "HOSPODA" */}
      <mesh castShadow position={[0, 2.5, 2.01]}>
        <boxGeometry args={[2.5, 0.6, 0.1]} />
        <meshStandardMaterial 
          color="#654321" 
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Dveře */}
      <mesh castShadow position={[0, 0.8, 2.01]}>
        <boxGeometry args={[1, 1.6, 0.1]} />
        <meshStandardMaterial 
          color="#5D4E37" 
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Okna */}
      <mesh position={[-1.5, 1.5, 2.01]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          roughness={0.1}
          metalness={0.3}
          emissive="#87CEEB"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[1.5, 1.5, 2.01]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          roughness={0.1}
          metalness={0.3}
          emissive="#87CEEB"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Pivní sklenice na cedulce - dekorativní */}
      <mesh position={[-0.8, 2.5, 2.05]}>
        <cylinderGeometry args={[0.15, 0.12, 0.3, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Pěna na pivu */}
      <mesh position={[-0.8, 2.65, 2.05]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFFAF0" />
      </mesh>

      {/* Komín */}
      <mesh castShadow position={[1.5, 4.8, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 1.5, 8]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
    </group>
  )
}