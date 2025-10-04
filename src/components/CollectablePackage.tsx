import { useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* DPD Logo text na přední straně */}
      <Text
        position={[0, 0, 0.41]}
        fontSize={0.3}
        color="#FF0000"
        anchorX="center"
        anchorY="middle"
      >
        DPD
      </Text>

      {/* DPD Logo text na zadní straně */}
      <Text
        position={[0, 0, -0.41]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.3}
        color="#FF0000"
        anchorX="center"
        anchorY="middle"
      >
        DPD
      </Text>

      {/* Svítící efekt pod krabicí */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.3}
        />
      </mesh>

      {/* Svítící částice nad krabicí */}
      <pointLight 
        position={[0, 1, 0]} 
        intensity={0.5} 
        distance={3} 
        color="#FFD700" 
      />
    </group>
  )
})

