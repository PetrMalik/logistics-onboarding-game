import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Airplane() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    
    timeRef.current += delta * 0.3 // Rychlost letu
    
    // Kruhová dráha letu
    const radius = 60
    const x = Math.cos(timeRef.current) * radius
    const z = Math.sin(timeRef.current) * radius
    const y = 20 + Math.sin(timeRef.current * 2) * 2 // Mírné vlnění nahoru a dolů
    
    groupRef.current.position.set(x, y, z)
    
    // Rotace letadla ve směru letu
    groupRef.current.rotation.y = -timeRef.current + Math.PI / 2
    
    // Mírný náklon při zatáčení
    groupRef.current.rotation.z = Math.sin(timeRef.current) * 0.1
  })

  return (
    <group ref={groupRef}>
      {/* Trup letadla */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Nos letadla */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial 
          color="#E74C3C" 
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Křídla */}
      <mesh castShadow position={[0, -0.3, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#3498DB" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Ocasní křídlo */}
      <mesh castShadow position={[0, -1.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial 
          color="#3498DB" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Vertikální stabilizátor */}
      <mesh castShadow position={[0, -1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#E74C3C" 
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Okna kokpitu */}
      <mesh position={[0, 0.8, 0.31]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Pruhy na trupu */}
      <mesh position={[0, 0.2, 0.31]}>
        <boxGeometry args={[0.05, 1.5, 0.02]} />
        <meshStandardMaterial 
          color="#E74C3C" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  )
}


