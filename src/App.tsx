import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import { PackageSortingGame } from './components/PackageSortingGame'
import './App.css'

function App() {
  const [showMiniGame, setShowMiniGame] = useState(false)

  const handleInteraction = () => {
    setShowMiniGame(true)
  }

  const handleCloseMiniGame = () => {
    setShowMiniGame(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Canvas
        shadows
        camera={{ position: [8, 10, 8], fov: 50 }}
        style={{ background: '#FFB88C' }}
      >
        <Scene onInteraction={handleInteraction} />
      </Canvas>
      
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
        <div style={{ marginTop: '10px', color: '#FFD700', fontWeight: 'bold' }}>
          E - Interakce (u depotu)
        </div>
      </div>

      {/* Mini hra */}
      {showMiniGame && <PackageSortingGame onClose={handleCloseMiniGame} />}
    </div>
  )
}

export default App
