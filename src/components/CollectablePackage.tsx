import { useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CollectablePackageProps {
  position: [number, number, number]
  onCollect?: () => void
}

export const CollectablePackage = memo(function CollectablePackage({ position }: CollectablePackageProps) {
  const groupRef = useRef<THREE.Group>(null)
  const rotationSpeed = 1.5 // Rychlost rotace

  // Rotace zásilky
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Hlavní hnědá krabice */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Červené DPD logo - jednoduchá geometrie místo textu */}
      <mesh position={[0, 0, 0.41]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial 
          color="#FF0000"
        />
      </mesh>
      
      <mesh position={[0, 0, -0.41]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial 
          color="#FF0000"
        />
      </mesh>

      {/* Svítící efekt pod krabicí - snížená kvalita */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  )
})

