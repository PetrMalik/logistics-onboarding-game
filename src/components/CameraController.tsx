import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraControllerProps {
  carRef: React.RefObject<THREE.Group>
}

export function CameraController({ carRef }: CameraControllerProps) {
  const { camera } = useThree()

  useFrame(() => {
    if (!carRef.current) return

    const carPosition = carRef.current.position
    const carRotation = carRef.current.rotation.y

    // Pozice kamery za autem
    const offset = new THREE.Vector3(
      Math.sin(carRotation) * -6,
      5,
      Math.cos(carRotation) * -6
    )

    const targetCameraPosition = new THREE.Vector3(
      carPosition.x + offset.x,
      offset.y,
      carPosition.z + offset.z
    )

    // Plynulý pohyb kamery
    camera.position.lerp(targetCameraPosition, 0.1)
    
    // Kamera se dívá na auto
    const lookAtPosition = new THREE.Vector3(
      carPosition.x,
      carPosition.y + 0.5,
      carPosition.z
    )
    camera.lookAt(lookAtPosition)
  })

  return null
}

