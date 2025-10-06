import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TrafficLightProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  initialState?: 'red' | 'yellow' | 'green'
}

export function TrafficLight({ 
  position, 
  rotation = [0, 0, 0],
  initialState = 'red'
}: TrafficLightProps) {
  const redLightRef = useRef<THREE.Mesh>(null)
  const yellowLightRef = useRef<THREE.Mesh>(null)
  const greenLightRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const stateRef = useRef<'red' | 'yellow' | 'green'>(initialState)

  useFrame((_, delta) => {
    timeRef.current += delta

    // Cyklus semaforu: červená (5s) -> zelená (5s) -> žlutá (2s)
    if (stateRef.current === 'red' && timeRef.current > 5) {
      stateRef.current = 'green'
      timeRef.current = 0
    } else if (stateRef.current === 'green' && timeRef.current > 5) {
      stateRef.current = 'yellow'
      timeRef.current = 0
    } else if (stateRef.current === 'yellow' && timeRef.current > 2) {
      stateRef.current = 'red'
      timeRef.current = 0
    }

    // Nastavení intenzity světel
    if (redLightRef.current && yellowLightRef.current && greenLightRef.current) {
      if (stateRef.current === 'red') {
        ;(redLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5
        ;(yellowLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0
        ;(greenLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0
      } else if (stateRef.current === 'yellow') {
        ;(redLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0
        ;(yellowLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5
        ;(greenLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0
      } else {
        ;(redLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0
        ;(yellowLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0
        ;(greenLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5
      }
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Sloupek semaforu */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Box semaforu */}
      <mesh castShadow position={[0, 3.5, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.3]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Červené světlo */}
      <mesh ref={redLightRef} position={[0, 3.9, 0.16]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={1.5}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Žluté světlo */}
      <mesh ref={yellowLightRef} position={[0, 3.5, 0.16]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial 
          color="#FFFF00" 
          emissive="#FFFF00" 
          emissiveIntensity={0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Zelené světlo */}
      <mesh ref={greenLightRef} position={[0, 3.1, 0.16]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial 
          color="#00FF00" 
          emissive="#00FF00" 
          emissiveIntensity={0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

