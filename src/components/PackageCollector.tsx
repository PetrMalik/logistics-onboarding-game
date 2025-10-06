import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CollectablePackage } from './CollectablePackage'
import { FloatingScore } from './FloatingScore'
import { useScore } from '../hooks/useScore'
import { roads } from '../utils/roadSystem'

interface PackageCollectorProps {
  carRef: React.RefObject<THREE.Group | null>
  packageCount?: number
}

interface PackageData {
  id: string
  position: [number, number, number]
  collected: boolean
}

interface FloatingScoreData {
  id: string
  position: [number, number, number]
}

// Funkce pro generování náhodných pozic na silnicích podle road systému
function generateRoadPosition(): [number, number, number] {
  // Vybrat náhodnou silnici
  const road = roads[Math.floor(Math.random() * roads.length)]
  
  if (road.rotation === 'horizontal') {
    // Horizontální silnice - náhodná pozice podél X osy
    const halfLength = road.length / 2
    const halfWidth = road.width / 2
    const x = road.x + (Math.random() * road.length - halfLength)
    const z = road.z + (Math.random() * road.width - halfWidth) * 0.5 // Blíž středu silnice
    return [x, 0.5, z]
  } else {
    // Vertikální silnice - náhodná pozice podél Z osy
    const halfLength = road.length / 2
    const halfWidth = road.width / 2
    const x = road.x + (Math.random() * road.width - halfWidth) * 0.5 // Blíž středu silnice
    const z = road.z + (Math.random() * road.length - halfLength)
    return [x, 0.5, z]
  }
}

export function PackageCollector({ carRef, packageCount = 10 }: PackageCollectorProps) {
  const { addScore } = useScore()
  const [packages, setPackages] = useState<PackageData[]>([])
  const [floatingScores, setFloatingScores] = useState<FloatingScoreData[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const collectionDistance = 2 // Vzdálenost pro sebrání zásilky
  const collectingRef = useRef<Set<string>>(new Set()) // Sledování právě sbíraných zásilek

  // Inicializace Audio Context jednou
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  // Funkce pro přehrání plink zvuku pomocí Web Audio API - optimalizovaná s useCallback
  const playPlinkSound = useCallback(() => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Nastavení zvuku - vysoký příjemný tón
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
    
    // Hlasitost - fade out efekt
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }, [])

  // Inicializace zásilek při načtení
  useEffect(() => {
    const initialPackages: PackageData[] = []
    for (let i = 0; i < packageCount; i++) {
      initialPackages.push({
        id: `package-${i}`,
        position: generateRoadPosition(),
        collected: false,
      })
    }
    setPackages(initialPackages)
  }, [packageCount])

  // Kontrola kolize každý frame - OPTIMALIZOVANÁ
  useFrame(() => {
    if (!carRef.current) return

    const carPosition = carRef.current.position
    const packagesToCollect: { id: string; position: [number, number, number] }[] = []

    // Kontrolovat pouze nesebrané zásilky
    for (const pkg of packages) {
      if (pkg.collected || collectingRef.current.has(pkg.id)) continue

      const pkgPosition = new THREE.Vector3(...pkg.position)
      const distance = carPosition.distanceTo(pkgPosition)

      // Pokud je auto dostatečně blízko, připravit k sebrání
      if (distance < collectionDistance) {
        packagesToCollect.push({ id: pkg.id, position: pkg.position })
        collectingRef.current.add(pkg.id) // Zabránit duplicitnímu sebrání
      }
    }

    // Pokud jsou nějaké zásilky k sebrání, zpracovat je najednou
    if (packagesToCollect.length > 0) {
      // Přehrát zvuk
      playPlinkSound()

      // Přidat body
      addScore(packagesToCollect.length)

      // Vytvořit floating "+1" texty na pozicích sebraných zásilek
      const newFloatingScores = packagesToCollect.map(pkg => ({
        id: `score-${pkg.id}-${Date.now()}`,
        position: pkg.position
      }))
      setFloatingScores(prev => [...prev, ...newFloatingScores])

      // Aktualizovat stav JEDNOU pro všechny sebrané zásilky
      setPackages(prev =>
        prev.map(p =>
          packagesToCollect.some(collected => collected.id === p.id) ? { ...p, collected: true } : p
        )
      )
    }
  })

  // Memoizovaný seznam nesbíraných zásilek pro optimalizaci renderování
  const activePackages = useMemo(
    () => packages.filter(pkg => !pkg.collected),
    [packages]
  )

  // Callback pro odstranění dokončené animace
  const handleScoreComplete = useCallback((id: string) => {
    setFloatingScores(prev => prev.filter(score => score.id !== id))
  }, [])

  // Renderovat pouze nesebrané zásilky a floating score animace
  return (
    <>
      {/* Sběratelné zásilky */}
      {activePackages.map(pkg => (
        <CollectablePackage
          key={pkg.id}
          position={pkg.position}
        />
      ))}

      {/* Floating "+1" animace */}
      {floatingScores.map(score => (
        <FloatingScore
          key={score.id}
          position={score.position}
          onComplete={() => handleScoreComplete(score.id)}
        />
      ))}
    </>
  )
}

