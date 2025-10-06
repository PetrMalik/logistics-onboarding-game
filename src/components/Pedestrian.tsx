import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PedestrianProps {
  route: [number, number, number][] // Trasa, po které chodec chodí
  speed?: number // Rychlost chůze
  color?: string // Barva oblečení
}

export function Pedestrian({ route, speed = 1.5, color = '#4A90E2' }: PedestrianProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  
  const progressRef = useRef(0) // Postup po trase (0-1)
  const walkPhaseRef = useRef(0) // Fáze animace chůze

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

    // Natočit chodce směrem chůze
    const direction = new THREE.Vector3().subVectors(segment.end, segment.start).normalize()
    const angle = Math.atan2(direction.x, direction.z)
    groupRef.current.rotation.y = angle

    // Animace chůze - houpe nohy a ruce
    walkPhaseRef.current += delta * speed * 3
    const walkCycle = Math.sin(walkPhaseRef.current)
    const legAngle = walkCycle * 0.5 // Houpání nohou

    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = legAngle
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = -legAngle
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = -legAngle * 0.7
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = legAngle * 0.7
    }

    // Mírné houpání těla při chůzi
    groupRef.current.position.y = position.y + Math.abs(Math.sin(walkPhaseRef.current * 2)) * 0.05
  })

  return (
    <group ref={groupRef}>
      {/* Tělo */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Hlava */}
      <mesh castShadow position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#FFDBAC" roughness={0.9} metalness={0} />
      </mesh>

      {/* Levá noha */}
      <group position={[-0.1, 0.4, 0]}>
        <mesh ref={leftLegRef} castShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#2C3E50" roughness={0.9} metalness={0} />
        </mesh>
      </group>

      {/* Pravá noha */}
      <group position={[0.1, 0.4, 0]}>
        <mesh ref={rightLegRef} castShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#2C3E50" roughness={0.9} metalness={0} />
        </mesh>
      </group>

      {/* Levá ruka */}
      <group position={[-0.25, 1, 0]}>
        <mesh ref={leftArmRef} castShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>
      </group>

      {/* Pravá ruka */}
      <group position={[0.25, 1, 0]}>
        <mesh ref={rightArmRef} castShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

