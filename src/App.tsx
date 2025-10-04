import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import './App.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ background: '#FFB88C' }}
      >
        <Scene />
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
      </div>
    </div>
  )
}

export default App
