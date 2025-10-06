import { useRef, forwardRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useCarControls } from '../hooks/useCarControls'
import { getValidPosition } from '../utils/roadSystem'
import dpdVanModel from '../assets/models/dpd-van-red.glb'

export const Car = forwardRef<THREE.Group, { onResetTrigger?: number }>((props, ref) => {
  const internalRef = useRef<THREE.Group>(null)
  const carRef = (ref as React.MutableRefObject<THREE.Group>) || internalRef
  
  // Načtení 3D modelu dodávky
  const { scene } = useGLTF(dpdVanModel)
  
  const { forward, backward, left, right, turbo } = useCarControls()
  
  const velocity = useRef(0)
  const rotation = useRef(0)
  const frontLeftLightRef = useRef<THREE.SpotLight>(null)
  const frontRightLightRef = useRef<THREE.SpotLight>(null)
  const brakeLightRef = useRef<THREE.PointLight>(null)

  // Reset pozice a rychlosti auta
  const resetPosition = useCallback(() => {
    if (carRef.current) {
      carRef.current.position.set(0, 0.5, 0)
      carRef.current.rotation.y = 0
      velocity.current = 0
      rotation.current = 0
    }
  }, [carRef])

  // Nastavení stínů pro všechny části 3D modelu
  useEffect(() => {
    if (scene) {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          // Vylepšení materiálů pro realističtější vzhled
          if (child.material) {
            const material = child.material as THREE.MeshStandardMaterial
            if (material.metalness !== undefined) {
              material.metalness = Math.max(material.metalness, 0.3)
              material.roughness = Math.min(material.roughness, 0.7)
            }
          }
        }
      })
    }
  }, [scene])

  // Sledování onResetTrigger prop pro resetování
  useEffect(() => {
    if (props.onResetTrigger !== undefined && props.onResetTrigger > 0) {
      resetPosition()
    }
  }, [props.onResetTrigger, resetPosition])

  useFrame((_, delta) => {
    if (!carRef.current) return

    // Parametry realistického jízdního modelu
    const baseMaxSpeed = 7.5 // Zvýšeno o 50% (z 5 na 7.5)
    const turboMultiplier = 1.8 // Turbo zvyšuje rychlost o 80%
    const maxSpeed = turbo ? baseMaxSpeed * turboMultiplier : baseMaxSpeed
    const maxReverseSpeed = 4 // Couvání je pomalejší
    const acceleration = turbo ? 12 : 8 // Turbo zvyšuje zrychlení
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
    const newX = carRef.current.position.x + Math.sin(angle) * velocity.current * delta
    const newZ = carRef.current.position.z + Math.cos(angle) * velocity.current * delta

    // Použití vylepšeného systému pro validaci pozice
    const validPosition = getValidPosition(
      carRef.current.position.x, 
      carRef.current.position.z, 
      newX, 
      newZ
    )
    
    // Aplikace validní pozice
    carRef.current.position.x = validPosition.x
    carRef.current.position.z = validPosition.z
    carRef.current.rotation.y = angle

    // Pokud se pozice změnila kvůli omezení, zpomal auto
    if (validPosition.x !== newX || validPosition.z !== newZ) {
      velocity.current = Math.max(0, velocity.current * 0.7)
    }

    // Globální omezení pro mapu (bezpečnostní omezení)
    carRef.current.position.x = Math.max(-100, Math.min(100, carRef.current.position.x))
    carRef.current.position.z = Math.max(-100, Math.min(100, carRef.current.position.z))
    
    // === OVLÁDÁNÍ SVĚTEL ===
    // Brzdová světla - svítí silněji při brzdění
    const isBraking = backward && isMovingForward
    if (brakeLightRef.current) {
      const targetIntensity = isBraking ? 3 : 0.8
      brakeLightRef.current.intensity = THREE.MathUtils.lerp(
        brakeLightRef.current.intensity,
        targetIntensity,
        delta * 10
      )
    }
    
    // Přední světla - svítí když je auto v pohybu
    const isMoving = Math.abs(velocity.current) > 0.5
    const headlightIntensity = isMoving ? 2 : 1
    if (frontLeftLightRef.current) {
      frontLeftLightRef.current.intensity = THREE.MathUtils.lerp(
        frontLeftLightRef.current.intensity,
        headlightIntensity,
        delta * 5
      )
    }
    if (frontRightLightRef.current) {
      frontRightLightRef.current.intensity = THREE.MathUtils.lerp(
        frontRightLightRef.current.intensity,
        headlightIntensity,
        delta * 5
      )
    }
  })

  return (
    <group ref={carRef} position={[0, 0.5, 0]} {...props}>
      {/* Načtený 3D model DPD dodávky */}
      <primitive 
        object={scene.clone()} 
        rotation={[0, Math.PI, 0]}
        scale={0.64}
      />
      
      {/* PŘEDNÍ SVĚTLA - Levé */}
      <spotLight
        ref={frontLeftLightRef}
        position={[0.4, 0.3, -1.2]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        distance={15}
        color="#FFFFDD"
      />
      {/* Vizuální reprezentace levého světla */}
      <mesh position={[0.4, 0.3, -1.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial
          color="#FFFFDD"
        />
      </mesh>
      
      {/* PŘEDNÍ SVĚTLA - Pravé */}
      <spotLight
        ref={frontRightLightRef}
        position={[-0.4, 0.3, -1.2]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        distance={15}
        color="#FFFFDD"
      />
      {/* Vizuální reprezentace pravého světla */}
      <mesh position={[-0.4, 0.3, -1.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial
          color="#FFFFDD"
        />
      </mesh>
      
      {/* ZADNÍ BRZDOVÁ SVĚTLA */}
      <pointLight
        ref={brakeLightRef}
        position={[0, 0.5, 1.2]}
        intensity={0.8}
        distance={5}
        color="#FF0000"
        decay={2}
      />
      {/* Vizuální reprezentace levého brzdového světla */}
      <mesh position={[0.35, 0.4, 1.15]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color="#FF0000"
        />
      </mesh>
      {/* Vizuální reprezentace pravého brzdového světla */}
      <mesh position={[-0.35, 0.4, 1.15]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color="#FF0000"
        />
      </mesh>
    </group>
  )
})

Car.displayName = 'Car'

// Preload 3D modelu pro lepší výkon
useGLTF.preload(dpdVanModel)

