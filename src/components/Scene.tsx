import { Car } from './Car'
import { Ground } from './Ground'
import { Environment } from './Environment'
import { CameraController } from './CameraController'
import { InteractiveDepot } from './InteractiveDepot'
import { InteractiveShop } from './InteractiveShop'
import { DeliveryLocker } from './DeliveryLocker'
import { Pub } from './Pub'
import { QuestNavigator } from './QuestNavigator'
import { PackageCollector } from './PackageCollector'
import { Pedestrians } from './Pedestrians'
import { Airplane } from './Airplane'
import { NPCCars } from './NPCCars'
import { TrafficLights } from './TrafficLights'
import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useInteraction } from '../hooks/useInteraction'
import { useQuest } from '../contexts/QuestContext'

interface SceneProps {
  onDepotInteraction: () => void
  onLockerInteraction: () => void
  onShopInteraction: () => void
  onPubInteraction: () => void
  onQuizInteraction: () => void
  carResetTrigger?: number
}

export default function Scene({ onDepotInteraction, onLockerInteraction, onShopInteraction, onPubInteraction, onQuizInteraction, carResetTrigger }: SceneProps) {
  const carRef = useRef<THREE.Group>(null)
  const depotPosition = new THREE.Vector3(50, 0, 0) // Na silnici X=50
  const lockerPosition = new THREE.Vector3(-50, 0, 0) // Na druhé straně
  const tabacoPosition = new THREE.Vector3(0, 0, 50) // Na třetí straně
  const pubPosition = new THREE.Vector3(25, 0, 25) // Hospoda na křižovatce
  const { quests } = useQuest()

  // Interakce pro depot (package sorting)
  const depot = useInteraction({
    carRef,
    targetPosition: depotPosition,
    interactionDistance: 3
  })

  // Interakce pro delivery locker
  const locker = useInteraction({
    carRef,
    targetPosition: lockerPosition,
    interactionDistance: 3
  })

   const tabaco = useInteraction({
    carRef,
    targetPosition: tabacoPosition,
    interactionDistance: 3
  })

  const pub = useInteraction({
    carRef,
    targetPosition: pubPosition,
    interactionDistance: 3
  })

  // Kontrola vzdálenosti každý frame
  useFrame(() => {
    depot.checkDistance()
    locker.checkDistance()
    tabaco.checkDistance()
    pub.checkDistance()
  })

  // Zjistit, jestli jsou questy dokončené
  const quest1 = quests.find(q => q.id === 'quest-1')
  const quest2 = quests.find(q => q.id === 'quest-2')
  const quest3 = quests.find(q => q.id === 'quest-3')
  const quest4 = quests.find(q => q.id === 'quest-4')

  // Když hráč interaguje s depotem
  if (depot.canInteract) {
    // Quest-1: Package Sorting
    if (!quest1?.completed) {
      onDepotInteraction()
    }
    // Quest-4: Quiz (návrat na depo)
    else if (!quest4?.completed && !quest4?.locked) {
      onQuizInteraction()
    }
    depot.resetInteraction()
  }

  // Když hráč interaguje s lockerem - jen pokud quest-2 není dokončený
  if (locker.canInteract) {
    if (!quest2?.completed && !quest2?.locked) {
      onLockerInteraction()
    }
    locker.resetInteraction()
  }

   if (tabaco.canInteract) {
    if (!quest3?.completed && !quest3?.locked) {
      onShopInteraction ()
    }
    tabaco.resetInteraction()
  }

  // Když hráč interaguje s hospodou - automaticky při průjezdu
  if (pub.isNearTarget) {
    onPubInteraction()
  }

  return (
    <>
      {/* Realistické osvětlení */}
      {/* Slunce - hlavní zdroj světla */}
      <directionalLight
        position={[50, 60, 30]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-near={0.5}
        shadow-camera-far={150}
        shadow-bias={-0.0001}
      />
      
      {/* Nízké ambientní světlo pro realistický kontrast */}
      <ambientLight intensity={0.3} />
      
      {/* Hemisférické světlo pro přirozený nádech oblohy a země */}
      <hemisphereLight
        color="#87CEEB"      // Barva oblohy - světle modrá
        groundColor="#8B7355" // Barva země - hnědá
        intensity={0.4}
      />
      
      {/* Doplňkové světlo zezadu pro lepší hloubku */}
      <directionalLight
        position={[-30, 20, -30]}
        intensity={0.3}
        color="#FFA07A"
      />
      
      {/* Mlha pro atmosférický efekt */}
      <fog attach="fog" args={['#FFB88C', 50, 180]} />

      {/* Kamera sledující auto */}
      <CameraController carRef={carRef} />

      {/* Autíčko */}
      <Car ref={carRef} onResetTrigger={carResetTrigger} />

      {/* Quest navigace - 3D šipka nad autem */}
      <QuestNavigator carRef={carRef} />

      {/* Sběratelné zásilky na silnicích */}
      <PackageCollector carRef={carRef} packageCount={14} />

      {/* Interaktivní depot (Package Sorting) */}
      <InteractiveDepot position={[depotPosition.x, depotPosition.y, depotPosition.z]} />

      {/* Výdejní box (Courier Delivery) */}
      <DeliveryLocker position={[lockerPosition.x, lockerPosition.y, lockerPosition.z]} />

      <InteractiveShop position={[tabacoPosition.x, tabacoPosition.y, tabacoPosition.z]} />

      {/* Hospoda - past na silnici */}
      <Pub position={[pubPosition.x, pubPosition.y, pubPosition.z]} />

      {/* Podlaha a krajina */}
      <Ground />

      {/* Prostředí - stromy, budovy, dekorace */}
      <Environment />

      {/* Letadlo létající nad mraky */}
      <Airplane />

      {/* Chodci procházející po mapě */}
      <Pedestrians />

      {/* NPC auta jezdící po silnicích */}
      <NPCCars />

      {/* Semafory na křižovatkách */}
      <TrafficLights />

      {/* Indikátor interakce u depotu - quest-1 nebo quest-4 */}
      {depot.isNearTarget && (!quest1?.completed || (!quest4?.completed && !quest4?.locked)) && (
        <mesh position={[depotPosition.x, 4.5, depotPosition.z]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color={!quest1?.completed ? "#FFD700" : "#667eea"} 
            emissive={!quest1?.completed ? "#FFD700" : "#667eea"} 
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {/* Indikátor interakce u lockeru - jen když není dokončený */}
      {locker.isNearTarget && !quest2?.completed && (
        <mesh position={[lockerPosition.x, 4.5, lockerPosition.z]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#3498DB" 
            emissive="#3498DB" 
            emissiveIntensity={1}
          />
        </mesh>
      )}

       {tabaco.isNearTarget && !quest3?.completed && !quest3?.locked && (
        <mesh position={[tabacoPosition.x, 4.5, tabacoPosition.z]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#3498DB" 
            emissive="#3498DB" 
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </>
  )
}

