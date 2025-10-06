import { useRef } from 'react'
import * as THREE from 'three'

interface InteractiveDepotProps {
  position: [number, number, number]
}

export function InteractiveDepot({ position }: InteractiveDepotProps) {
  const depotRef = useRef<THREE.Group>(null)

  return (
    <group ref={depotRef} position={position}>
      {/* Základna budovy */}
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial 
          color="#8B7355" 
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      {/* Střecha */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[3, 1.5, 4]} />
        <meshStandardMaterial 
          color="#6B5345" 
          roughness={0.75}
          metalness={0}
        />
      </mesh>

      {/* Dveře */}
      <mesh castShadow position={[0, 0.6, 2.01]}>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <meshStandardMaterial 
          color="#5D4E37" 
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Značka interakce (kroužek nad budovou) */}
      <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 8, 16]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}


