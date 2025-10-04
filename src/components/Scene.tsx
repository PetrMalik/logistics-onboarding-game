import { Car } from './Car'
import { Ground } from './Ground'
import { Environment } from './Environment'
import { CameraController } from './CameraController'
import { InteractiveDepot } from './InteractiveDepot'
import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useInteraction } from '../hooks/useInteraction'

interface SceneProps {
  onInteraction: () => void
}

export default function Scene({ onInteraction }: SceneProps) {
  const carRef = useRef<THREE.Group>(null)
  const depotPosition = new THREE.Vector3(50, 0, 0) // Na silnici X=50

  const { isNearTarget, canInteract, checkDistance, resetInteraction } = useInteraction({
    carRef,
    targetPosition: depotPosition,
    interactionDistance: 3
  })

  // Kontrola vzdálenosti každý frame
  useFrame(() => {
    checkDistance()
  })

  // Když hráč interaguje, zavoláme callback a resetujeme
  if (canInteract) {
    onInteraction()
    resetInteraction()
  }

  return (
    <>
      {/* Osvětlení - upravené pro větší plochu */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 40, 20]}
        intensity={1}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
      />
      <hemisphereLight
        color="#FFD4A3"
        groundColor="#FF9B6B"
        intensity={0.5}
      />

      {/* Kamera sledující auto */}
      <CameraController carRef={carRef} />

      {/* Autíčko */}
      <Car ref={carRef} />

      {/* Interaktivní depot */}
      <InteractiveDepot position={[depotPosition.x, depotPosition.y, depotPosition.z]} />

      {/* Podlaha a krajina */}
      <Ground />

      {/* Prostředí - stromy, budovy, dekorace */}
      <Environment />

      {/* Indikátor interakce */}
      {isNearTarget && (
        <mesh position={[depotPosition.x, 4.5, depotPosition.z]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </>
  )
}

