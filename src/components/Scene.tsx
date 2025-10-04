import { Car } from './Car'
import { Ground } from './Ground'
import { Environment } from './Environment'
import { CameraController } from './CameraController'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Scene() {
  const carRef = useRef<THREE.Group>(null)

  return (
    <>
      {/* Osvětlení */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
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

      {/* Podlaha a krajina */}
      <Ground />

      {/* Prostředí - stromy, budovy, dekorace */}
      <Environment />
    </>
  )
}

