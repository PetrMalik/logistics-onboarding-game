import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NPCCarProps {
  route: [number, number, number][] // Trasa, po které auto jezdí
  speed?: number // Rychlost jízdy
  color?: string // Barva auta
}

export function NPCCar({ route, speed = 8, color = '#E74C3C' }: NPCCarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const frontWheelLeftRef = useRef<THREE.Mesh>(null)
  const frontWheelRightRef = useRef<THREE.Mesh>(null)
  const backWheelLeftRef = useRef<THREE.Mesh>(null)
  const backWheelRightRef = useRef<THREE.Mesh>(null)
  
  const progressRef = useRef(Math.random()) // Náhodný start
  const wheelRotationRef = useRef(0)

  // Vypočítat celkovou délku trasy
  const routeSegments = useMemo(() => {
    const segments: { start: THREE.Vector3; end: THREE.Vector3; length: number }[] = []
    let totalLength = 0

    for (let i = 0; i < route.length; i++) {
      const start = new THREE.Vector3(...route[i])
      const end = new THREE.Vector3(...route[(i + 1) % route.length])
      const length = start.distanceTo(end)
      segments.push({ start, end, length })
      totalLength += length
    }

    return { segments, totalLength }
  }, [route])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Aktualizovat postup po trase
    const distancePerSecond = speed
    const progressDelta = (distancePerSecond * delta) / routeSegments.totalLength
    progressRef.current = (progressRef.current + progressDelta) % 1

    // Najít aktuální segment a pozici na trase
    let accumulatedLength = 0
    let currentSegmentIndex = 0
    let segmentProgress = 0

    for (let i = 0; i < routeSegments.segments.length; i++) {
      const segmentLength = routeSegments.segments[i].length
      const segmentEnd = (accumulatedLength + segmentLength) / routeSegments.totalLength

      if (progressRef.current <= segmentEnd) {
        currentSegmentIndex = i
        const segmentStart = accumulatedLength / routeSegments.totalLength
        segmentProgress = (progressRef.current - segmentStart) / (segmentEnd - segmentStart)
        break
      }

      accumulatedLength += segmentLength
    }

    // Interpolovat pozici
    const segment = routeSegments.segments[currentSegmentIndex]
    const position = new THREE.Vector3().lerpVectors(
      segment.start,
      segment.end,
      segmentProgress
    )

    groupRef.current.position.copy(position)
    groupRef.current.position.y = 0.3 // Výška auta nad zemí

    // Natočit auto směrem jízdy
    const direction = new THREE.Vector3().subVectors(segment.end, segment.start).normalize()
    const angle = Math.atan2(direction.x, direction.z)
    groupRef.current.rotation.y = angle

    // Animace rotace kol
    wheelRotationRef.current += delta * speed * 2
    if (frontWheelLeftRef.current) frontWheelLeftRef.current.rotation.x = wheelRotationRef.current
    if (frontWheelRightRef.current) frontWheelRightRef.current.rotation.x = wheelRotationRef.current
    if (backWheelLeftRef.current) backWheelLeftRef.current.rotation.x = wheelRotationRef.current
    if (backWheelRightRef.current) backWheelRightRef.current.rotation.x = wheelRotationRef.current
  })

  return (
    <group ref={groupRef}>
      {/* Hlavní tělo auta */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.5, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Kabina/střecha */}
      <mesh castShadow position={[0, 0.75, -0.2]}>
        <boxGeometry args={[1.0, 0.5, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Přední sklo */}
      <mesh castShadow position={[0, 0.75, 0.4]}>
        <boxGeometry args={[0.9, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          roughness={0.1} 
          metalness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Zadní sklo */}
      <mesh castShadow position={[0, 0.75, -0.8]}>
        <boxGeometry args={[0.9, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          roughness={0.1} 
          metalness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Přední světla */}
      <mesh position={[0.4, 0.3, 1.15]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#FFFFE0" 
          emissive="#FFFFE0" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-0.4, 0.3, 1.15]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#FFFFE0" 
          emissive="#FFFFE0" 
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Zadní světla */}
      <mesh position={[0.4, 0.3, -1.15]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[-0.4, 0.3, -1.15]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Kola */}
      {/* Přední levé kolo */}
      <mesh ref={frontWheelLeftRef} castShadow position={[-0.7, 0.15, 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Přední pravé kolo */}
      <mesh ref={frontWheelRightRef} castShadow position={[0.7, 0.15, 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Zadní levé kolo */}
      <mesh ref={backWheelLeftRef} castShadow position={[-0.7, 0.15, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Zadní pravé kolo */}
      <mesh ref={backWheelRightRef} castShadow position={[0.7, 0.15, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Disky kol */}
      <mesh position={[-0.8, 0.15, 0.7]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.15, 0.7]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-0.8, 0.15, -0.7]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.15, -0.7]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  )
}

