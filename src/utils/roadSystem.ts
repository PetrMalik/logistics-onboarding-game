// Systém silnic - definice a kolizní detekce

export interface Road {
  x: number
  z: number
  width: number
  length: number
  rotation: 'horizontal' | 'vertical'
}

// Definice všech silnic v systému
export const roads: Road[] = [
  // Hlavní křižovatka
  { x: 0, z: 0, width: 6, length: 200, rotation: 'horizontal' },
  { x: 0, z: 0, width: 6, length: 200, rotation: 'vertical' },
  
  // Horizontální silnice
  { x: 0, z: 25, width: 6, length: 160, rotation: 'horizontal' },
  { x: 0, z: -25, width: 6, length: 160, rotation: 'horizontal' },
  { x: 0, z: 50, width: 6, length: 120, rotation: 'horizontal' },
  { x: 0, z: -50, width: 6, length: 120, rotation: 'horizontal' },
  { x: 0, z: 75, width: 6, length: 80, rotation: 'horizontal' },
  { x: 0, z: -75, width: 6, length: 80, rotation: 'horizontal' },
  
  // Vertikální silnice
  { x: 25, z: 0, width: 6, length: 160, rotation: 'vertical' },
  { x: -25, z: 0, width: 6, length: 160, rotation: 'vertical' },
  { x: 50, z: 0, width: 6, length: 120, rotation: 'vertical' },
  { x: -50, z: 0, width: 6, length: 120, rotation: 'vertical' },
  { x: 75, z: 0, width: 6, length: 80, rotation: 'vertical' },
  { x: -75, z: 0, width: 6, length: 80, rotation: 'vertical' },
]

// Funkce pro kontrolu, zda je pozice na silnici - vylepšená verze
export function isOnRoad(x: number, z: number, tolerance: number = 0.2): boolean {
  for (const road of roads) {
    if (road.rotation === 'horizontal') {
      // Kontrola horizontální silnice
      const halfLength = road.length / 2
      const halfWidth = road.width / 2
      
      if (
        Math.abs(z - road.z) <= halfWidth + tolerance &&
        x >= road.x - halfLength - tolerance &&
        x <= road.x + halfLength + tolerance
      ) {
        return true
      }
    } else {
      // Kontrola vertikální silnice
      const halfLength = road.length / 2
      const halfWidth = road.width / 2
      
      if (
        Math.abs(x - road.x) <= halfWidth + tolerance &&
        z >= road.z - halfLength - tolerance &&
        z <= road.z + halfLength + tolerance
      ) {
        return true
      }
    }
  }
  return false
}

// Funkce pro najití nejbližší pozice na silnici - vylepšená verze
export function getNearestRoadPosition(x: number, z: number): { x: number, z: number } {
  let nearestDistance = Infinity
  let nearestPosition = { x: 0, z: 0 } // Default na střed hlavní křižovatky
  
  for (const road of roads) {
    let clampedX: number
    let clampedZ: number
    
    if (road.rotation === 'horizontal') {
      const halfLength = road.length / 2
      const halfWidth = road.width / 2
      
      // Omezit x na délku silnice
      clampedX = Math.max(road.x - halfLength, Math.min(road.x + halfLength, x))
      // Omezit z na šířku silnice
      clampedZ = Math.max(road.z - halfWidth, Math.min(road.z + halfWidth, z))
    } else {
      const halfLength = road.length / 2
      const halfWidth = road.width / 2
      
      // Omezit x na šířku silnice
      clampedX = Math.max(road.x - halfWidth, Math.min(road.x + halfWidth, x))
      // Omezit z na délku silnice
      clampedZ = Math.max(road.z - halfLength, Math.min(road.z + halfLength, z))
    }
    
    const distance = Math.sqrt((x - clampedX) ** 2 + (z - clampedZ) ** 2)
    
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestPosition = { x: clampedX, z: clampedZ }
    }
  }
  
  return nearestPosition
}

// Nová funkce pro kontrolu validity nové pozice s plynulejším omezením
export function getValidPosition(currentX: number, currentZ: number, newX: number, newZ: number): { x: number, z: number } {
  // Pokud je nová pozice na silnici, povolíme ji
  if (isOnRoad(newX, newZ, 0.3)) {
    return { x: newX, z: newZ }
  }
  
  // Pokud není, zkusíme najít nejbližší validní pozici
  const nearest = getNearestRoadPosition(newX, newZ)
  
  // Pokud je vzdálenost k nejbližší silnici malá, použijeme ji
  const distanceToNearest = Math.sqrt((newX - nearest.x) ** 2 + (newZ - nearest.z) ** 2)
  if (distanceToNearest < 2) {
    return nearest
  }
  
  // Jinak zůstaneme na současné pozici
  return { x: currentX, z: currentZ }
}