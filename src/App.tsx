import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import { PackageSortingGame } from './components/PackageSortingGame'
import { CourierDeliveryGame } from './components/CourierDeliveryGame'
import { ScoreDisplay } from './components/ScoreDisplay'
import { QuestList } from './components/QuestList'
import { ScoreProvider } from './contexts/ScoreContext'
import { QuestProvider } from './contexts/QuestContext'
import './App.css'

type ActiveGame = 'none' | 'package-sorting' | 'courier-delivery'

function App() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none')

  const handleDepotInteraction = () => {
    setActiveGame('package-sorting')
  }

  const handleLockerInteraction = () => {
    setActiveGame('courier-delivery')
  }

  const handleCloseGame = () => {
    setActiveGame('none')
  }

  return (
    <ScoreProvider>
      <QuestProvider>
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
          <Canvas
            shadows
            camera={{ position: [8, 10, 8], fov: 50 }}
            style={{ background: '#FFB88C' }}
          >
            <Scene 
              onDepotInteraction={handleDepotInteraction}
              onLockerInteraction={handleLockerInteraction}
            />
          </Canvas>
          
          {/* Quest List */}
          <QuestList />
          
          {/* Score Display */}
          <ScoreDisplay />
          
          {/* Ovládání nápověda */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          background: 'rgba(0,0,0,0.3)',
          padding: '15px',
          borderRadius: '10px'
        }}>
          <div><strong>Ovládání:</strong></div>
          <div>W - Vpřed</div>
          <div>S - Vzad</div>
          <div>A - Doleva</div>
          <div>D - Doprava</div>
          <div style={{ marginTop: '10px', color: '#FF6B6B', fontWeight: 'bold' }}>
            Shift - Turbo 🚀
          </div>
          <div style={{ marginTop: '10px', color: '#FFD700', fontWeight: 'bold' }}>
            E - Interakce (u depotu)
          </div>
        </div>

          {/* Package Sorting Mini Game */}
          {activeGame === 'package-sorting' && (
            <PackageSortingGame onClose={handleCloseGame} />
          )}

          {/* Courier Delivery Mini Game */}
          {activeGame === 'courier-delivery' && (
            <CourierDeliveryGame onClose={handleCloseGame} />
          )}
        </div>
      </QuestProvider>
    </ScoreProvider>
  )
}

export default App
