import { useRef } from 'react'
import * as THREE from 'three'

interface InteractiveShopProps {
  position: [number, number, number]
  isLocked?: boolean
  isCompleted?: boolean
}

export function InteractiveShop({ position, isLocked = false, isCompleted = false }: InteractiveShopProps) {
  const shopRef = useRef<THREE.Group>(null)

  // Barva podle stavu
  const baseColor = isCompleted ? '#4CAF50' : isLocked ? '#CCCCCC' : '#FF69B4'
  const accentColor = isCompleted ? '#388E3C' : isLocked ? '#AAAAAA' : '#FF1493'

  return (
    <group ref={shopRef} position={position}>
      {/* Základna trafiky - kreslený styl */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[5, 3, 3]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Štít trafiky */}
      <mesh castShadow position={[0, 3.2, 0]}>
        <boxGeometry args={[5.2, 0.4, 3.2]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Výloha - velké okno */}
      <mesh position={[2.51, 1.8, 0]}>
        <boxGeometry args={[0.02, 2, 2.5]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
      </mesh>

      {/* Vstupní dveře */}
      <mesh position={[0, 0.8, 1.51]}>
        <boxGeometry args={[1.2, 1.6, 0.1]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Klamka */}
      <mesh position={[0.4, 0.8, 1.56]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#B8860B" />
      </mesh>

      {/* Cedule "TRAFIKA" */}
      <mesh position={[0, 2.8, 1.6]}>
        <boxGeometry args={[2.5, 0.6, 0.1]} />
        <meshStandardMaterial color="#FFF8DC" />
      </mesh>

      {/* Text na ceduli (simulovaný pomocí malých boxů) */}
      <group position={[0, 2.8, 1.65]}>
        {/* T */}
        <mesh position={[-1, 0, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[-1, -0.1, 0]}>
          <boxGeometry args={[0.05, 0.25, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        {/* R */}
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[-0.35, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        {/* A */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[0.075, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        {/* F */}
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[0.65, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.15, 0.05, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        {/* I */}
        <mesh position={[0.9, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        {/* K */}
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[1.35, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        
        {/* A */}
        <mesh position={[1.6, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[1.675, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.02]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
      </group>

      {/* Marketingové cedule na straně */}
      <mesh position={[-2.6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>

      {/* Koš na odpadky před trafikou */}
      <mesh position={[3, 0.4, 1]}>
        <cylinderGeometry args={[0.3, 0.35, 0.8, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Víko koše */}
      <mesh position={[3, 0.85, 1]}>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 8]} />
        <meshStandardMaterial color="#006400" />
      </mesh>

      {/* Dekorativní květiny u vchodu */}
      <group position={[-1.5, 0.3, 2]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>
      </group>

      <group position={[1.5, 0.3, 2]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      </group>
    </group>
  )
}