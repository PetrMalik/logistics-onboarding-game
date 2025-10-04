import { useEffect, useState } from 'react'
import * as THREE from 'three'

interface UseInteractionProps {
  carRef: React.RefObject<THREE.Group>
  targetPosition: THREE.Vector3
  interactionDistance?: number
}

export function useInteraction({ 
  carRef, 
  targetPosition, 
  interactionDistance = 3 
}: UseInteractionProps) {
  const [isNearTarget, setIsNearTarget] = useState(false)
  const [canInteract, setCanInteract] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        if (isNearTarget) {
          setCanInteract(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isNearTarget])

  // Zkontrolovat vzdálenost v každém frame se volá z komponenty
  const checkDistance = () => {
    if (!carRef.current) return

    const carPosition = carRef.current.position
    const distance = carPosition.distanceTo(targetPosition)
    
    setIsNearTarget(distance < interactionDistance)
  }

  const resetInteraction = () => {
    setCanInteract(false)
  }

  return {
    isNearTarget,
    canInteract,
    checkDistance,
    resetInteraction
  }
}


