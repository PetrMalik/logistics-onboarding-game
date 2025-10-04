import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraControllerProps {
  carRef: React.RefObject<THREE.Group | null>
}

export function CameraController({ carRef }: CameraControllerProps) {
  const { camera } = useThree()

  useFrame(() => {
    if (!carRef.current) return

    const carPosition = carRef.current.position

    // Kamera z dálky a ze strany (více izometrický pohled pro větší mapu)
    const targetCameraPosition = new THREE.Vector3(
      carPosition.x + 12,  // Ze strany (doprava) - více dál
      15,                  // Výš nad scénou pro lepší přehled
      carPosition.z + 12   // Zezadu - více dál
    )

    // Velmi plynulý pohyb kamery
    camera.position.lerp(targetCameraPosition, 0.05)
    
    // Kamera se dívá mírně před auto (ne přímo na něj)
    const lookAtPosition = new THREE.Vector3(
      carPosition.x,
      carPosition.y,
      carPosition.z
    )
    camera.lookAt(lookAtPosition)
  })

  return null
}

