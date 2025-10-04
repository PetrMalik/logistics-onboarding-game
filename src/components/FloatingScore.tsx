import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingScoreProps {
  position: [number, number, number]
  onComplete: () => void
}

export function FloatingScore({ position, onComplete }: FloatingScoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const animationDuration = 1.5 // Délka animace v sekundách

  useEffect(() => {
    // Zavolat onComplete po dokončení animace
    const timer = setTimeout(() => {
      onComplete()
    }, animationDuration * 1000)

    return () => clearTimeout(timer)
  }, [onComplete, animationDuration])

  // Animace - vyletí nahoru a fade out
  useFrame((_, delta) => {
    if (!groupRef.current) return

    progress.current += delta / animationDuration

    if (progress.current <= 1) {
      // Vyletí nahoru (ease-out efekt)
      const easeOut = 1 - Math.pow(1 - progress.current, 3)
      groupRef.current.position.y = position[1] + easeOut * 3

      // Fade out (začne mizet po 50% animace)
      const opacity = progress.current < 0.5 ? 1 : 1 - (progress.current - 0.5) * 2
      
      // Mírně se zvětší na začátku
      const scale = progress.current < 0.2 
        ? 1 + progress.current * 2 
        : 1.4 - progress.current * 0.4

      groupRef.current.scale.setScalar(scale)

      // Aktualizovat opacity (pokud má Text material)
      if (groupRef.current.children[0]) {
        const textMesh = groupRef.current.children[0] as any
        if (textMesh.material) {
          textMesh.material.opacity = opacity
        }
      }
    }
  })

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <Text
        fontSize={0.8}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#8B4513"
      >
        +1
      </Text>
      
      {/* Svítící efekt */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={1} 
        distance={2} 
        color="#FFD700" 
      />
    </group>
  )
}

