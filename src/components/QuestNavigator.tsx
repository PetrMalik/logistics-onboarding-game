import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuest } from '../contexts/QuestContext'

interface QuestNavigatorProps {
  carRef: React.RefObject<THREE.Group | null>
}

// Mapování questů na pozice ve světě
const QUEST_LOCATIONS: Record<string, THREE.Vector3> = {
  'quest-1': new THREE.Vector3(50, 0, 0),    // Depot
  'quest-2': new THREE.Vector3(-50, 0, 0),   // Delivery Locker
  'quest-3': new THREE.Vector3(0, 0, 50),    // Nějaká další lokace (můžeš upravit)
}

export function QuestNavigator({ carRef }: QuestNavigatorProps) {
  const arrowRef = useRef<THREE.Group>(null)
  const { currentQuest } = useQuest()

  useFrame(() => {
    if (!carRef.current || !arrowRef.current || !currentQuest) return

    const carPosition = carRef.current.position
    const targetPosition = QUEST_LOCATIONS[currentQuest.id]

    if (!targetPosition) return

    // Vypočítat směr k cíli
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, carPosition)
      .normalize()

    // Rotace šipky směrem k cíli (opačný směr oproti původnímu)
    const angle = Math.atan2(direction.x, direction.z)
    arrowRef.current.rotation.y = -angle

    // Šipka nad autem
    arrowRef.current.position.set(
      carPosition.x,
      carPosition.y + 2.5,
      carPosition.z
    )

    // Animace nahoru a dolů
    const time = Date.now() * 0.003
    arrowRef.current.position.y = carPosition.y + 2.5 + Math.sin(time) * 0.2
  })

  // Nezobrazovat šipku, pokud není aktivní quest
  if (!currentQuest || !QUEST_LOCATIONS[currentQuest.id]) {
    return null
  }

  return (
    <group ref={arrowRef}>
      {/* Jednoduchá šipka - jen kužel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.5, 1.5, 8]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.0}
        />
      </mesh>
    </group>
  )
}

