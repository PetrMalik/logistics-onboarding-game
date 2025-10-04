import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useQuest } from '../contexts/QuestContext'
import './QuestNavigatorUI.css'

interface QuestNavigatorUIProps {
  carRef: React.RefObject<THREE.Group | null>
}

// Mapování questů na pozice ve světě
const QUEST_LOCATIONS: Record<string, THREE.Vector3> = {
  'quest-1': new THREE.Vector3(50, 0, 0),    // Depot
  'quest-2': new THREE.Vector3(-50, 0, 0),   // Delivery Locker
  'quest-3': new THREE.Vector3(0, 0, 50),    // Nějaká další lokace
}

export function QuestNavigatorUI({ carRef }: QuestNavigatorUIProps) {
  const { currentQuest } = useQuest()
  const [distance, setDistance] = useState<number>(0)
  const [direction, setDirection] = useState<string>('N')

  useEffect(() => {
    if (!currentQuest || !carRef.current) return

    const targetPosition = QUEST_LOCATIONS[currentQuest.id]
    if (!targetPosition) return

    const interval = setInterval(() => {
      if (!carRef.current) return

      const carPosition = carRef.current.position

      // Vypočítat vzdálenost
      const dist = carPosition.distanceTo(targetPosition)
      setDistance(Math.round(dist))

      // Vypočítat směr k cíli (absolutní kompasový směr)
      const dx = targetPosition.x - carPosition.x
      const dz = targetPosition.z - carPosition.z
      
      // Určit směr jako text (N, S, E, W, NE, NW, SE, SW)
      let dirText = ''
      if (Math.abs(dz) > Math.abs(dx)) {
        // Primárně sever/jih
        dirText = dz > 0 ? 'S' : 'N'
        if (Math.abs(dx) > 10) {
          dirText += dx > 0 ? 'E' : 'W'
        }
      } else {
        // Primárně východ/západ
        dirText = dx > 0 ? 'E' : 'W'
        if (Math.abs(dz) > 10) {
          dirText = (dz > 0 ? 'S' : 'N') + dirText
        }
      }
      
      setDirection(dirText)
    }, 100) // Update každých 100ms

    return () => clearInterval(interval)
  }, [currentQuest, carRef])

  // Nezobrazovat, pokud není aktivní quest
  if (!currentQuest || !QUEST_LOCATIONS[currentQuest.id]) {
    return null
  }

  return (
    <div className="quest-navigator-ui">
      <div className="navigator-container">
        <div className="navigator-title">
          <span className="quest-icon">🎯</span>
          {currentQuest.title}
        </div>
        
        <div className="navigator-content">
          {/* Kompasový směr */}
          <div className="compass-container">
            <div className="compass-direction">
              {direction}
            </div>
            <div className="compass-label">směr</div>
          </div>

          {/* Vzdálenost */}
          <div className="distance-info">
            <div className="distance-value">{distance}</div>
            <div className="distance-unit">m</div>
          </div>
        </div>

        {/* Progress bar basovaný na vzdálenosti */}
        <div className="distance-bar">
          <div 
            className="distance-progress"
            style={{ 
              width: `${Math.max(0, Math.min(100, 100 - (distance / 100) * 100))}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}

