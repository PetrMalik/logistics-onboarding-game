import { useRef, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCarControls } from '../hooks/useCarControls'

export const Car = forwardRef<THREE.Group>((props, ref) => {
  const internalRef = useRef<THREE.Group>(null)
  const carRef = (ref as React.MutableRefObject<THREE.Group>) || internalRef
  
  const { forward, backward, left, right } = useCarControls()
  
  const velocity = useRef(0)
  const rotation = useRef(0)

  useFrame((_, delta) => {
    if (!carRef.current) return

    // Parametry realistického jízdního modelu
    const maxSpeed = 7.5 // Zvýšeno o 50% (z 5 na 7.5)
    const maxReverseSpeed = 4 // Couvání je pomalejší
    const acceleration = 8 // Zrychlení při sešlápnutí plynu
    const braking = 12 // Aktivní brzdění (S klávesa)
    const friction = 3 // Pasivní zpomalení (třecí odpor)
    const rotationSpeed = 2.5
    
    const currentSpeed = Math.abs(velocity.current)
    const isMovingForward = velocity.current > 0.1

    // === AKCELERACE A BRZDĚNÍ ===
    if (forward) {
      // Vpřed - exponenciální akcelerace (rychlejší rozjezd na začátku)
      const accelFactor = 1 - (currentSpeed / maxSpeed)
      velocity.current += delta * acceleration * Math.max(0.3, accelFactor)
      velocity.current = Math.min(velocity.current, maxSpeed)
    } else if (backward) {
      if (isMovingForward) {
        // Pokud jedeme vpřed a zmáčkneme S -> AKTIVNÍ BRZDĚNÍ
        velocity.current -= delta * braking
      } else {
        // Jinak couvání
        const accelFactor = 1 - (currentSpeed / maxReverseSpeed)
        velocity.current -= delta * acceleration * 0.7 * Math.max(0.3, accelFactor)
        velocity.current = Math.max(velocity.current, -maxReverseSpeed)
      }
    } else {
      // Žádná klávesa -> PASIVNÍ zpomalení (třecí odpor)
      if (Math.abs(velocity.current) > 0.01) {
        const frictionForce = delta * friction * (1 + currentSpeed * 0.1)
        if (velocity.current > 0) {
          velocity.current = Math.max(0, velocity.current - frictionForce)
        } else {
          velocity.current = Math.min(0, velocity.current + frictionForce)
        }
      } else {
        velocity.current = 0
      }
    }

    // === ZATÁČENÍ ===
    // Rychlost zatáčení závisí na rychlosti jízdy (při vyšší rychlosti mírnější zatáčení)
    if (Math.abs(velocity.current) > 0.5) {
      const turnFactor = 1 / (1 + currentSpeed * 0.15) // Při vyšší rychlosti těžší zatáčení
      const turnSpeed = rotationSpeed * turnFactor
      
      if (left) {
        rotation.current += delta * turnSpeed * Math.sign(velocity.current)
      }
      if (right) {
        rotation.current -= delta * turnSpeed * Math.sign(velocity.current)
      }
    }

    // === APLIKACE POHYBU ===
    const angle = rotation.current
    carRef.current.position.x += Math.sin(angle) * velocity.current * delta
    carRef.current.position.z += Math.cos(angle) * velocity.current * delta
    carRef.current.rotation.y = angle

    // Omezení pohybu v rámci mapy
    carRef.current.position.x = Math.max(-25, Math.min(25, carRef.current.position.x))
    carRef.current.position.z = Math.max(-25, Math.min(25, carRef.current.position.z))
  })

  return (
    <group ref={carRef} position={[0, 0.5, 0]} {...props}>
      {/* Karoserie */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.5, 2]} />
        <meshStandardMaterial color="#E85D4D" />
      </mesh>

      {/* Kabina */}
      <mesh castShadow position={[0, 0.8, -0.2]}>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshStandardMaterial color="#D94D3D" />
      </mesh>

      {/* Okna */}
      <mesh position={[-0.45, 0.8, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.8]} />
        <meshStandardMaterial color="#87CEEB" opacity={0.6} transparent />
      </mesh>
      <mesh position={[0.45, 0.8, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.8]} />
        <meshStandardMaterial color="#87CEEB" opacity={0.6} transparent />
      </mesh>

      {/* Přední světla */}
      <mesh position={[0.35, 0.35, 1.05]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#FFF4E0" emissive="#FFF4E0" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.35, 0.35, 1.05]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#FFF4E0" emissive="#FFF4E0" emissiveIntensity={0.3} />
      </mesh>

      {/* Kola */}
      <group>
        {/* Přední levé */}
        <mesh castShadow position={[-0.65, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#2C2C2C" />
        </mesh>
        {/* Přední pravé */}
        <mesh castShadow position={[0.65, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#2C2C2C" />
        </mesh>
        {/* Zadní levé */}
        <mesh castShadow position={[-0.65, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#2C2C2C" />
        </mesh>
        {/* Zadní pravé */}
        <mesh castShadow position={[0.65, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#2C2C2C" />
        </mesh>
      </group>
    </group>
  )
})

Car.displayName = 'Car'

