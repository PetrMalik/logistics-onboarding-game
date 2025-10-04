import { useRef } from 'react'
import * as THREE from 'three'

interface DeliveryLockerProps {
  position: [number, number, number]
}

export function DeliveryLocker({ position }: DeliveryLockerProps) {
  const lockerRef = useRef<THREE.Group>(null)

  return (
    <group ref={lockerRef} position={position}>
      {/* Hlavní tělo výdejního boxu */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[3, 3, 1]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>

      {/* Displej/obrazovka nahoře */}
      <mesh position={[0, 2.8, 0.51]}>
        <boxGeometry args={[1.2, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          emissive="#00ff00" 
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Grid schránek (3x3 pro vizualizaci) */}
      {Array.from({ length: 9 }).map((_, index) => {
        const row = Math.floor(index / 3)
        const col = index % 3
        const x = (col - 1) * 0.85
        const y = 1.5 - row * 0.85
        
        return (
          <group key={index}>
            {/* Dvířka schránky */}
            <mesh position={[x, y, 0.51]}>
              <boxGeometry args={[0.75, 0.75, 0.05]} />
              <meshStandardMaterial color="#34495E" />
            </mesh>
            {/* Číslo schránky */}
            <mesh position={[x, y, 0.54]}>
              <boxGeometry args={[0.15, 0.15, 0.02]} />
              <meshStandardMaterial 
                color="#ECF0F1" 
                emissive="#3498DB"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        )
      })}

      {/* Podstavec */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[3.2, 0.3, 1.2]} />
        <meshStandardMaterial color="#1C2833" />
      </mesh>

      {/* Značka interakce (kroužek nad boxem) */}
      <mesh position={[0, 3.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 8, 16]} />
        <meshStandardMaterial 
          color="#3498DB" 
          emissive="#3498DB" 
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

