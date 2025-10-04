import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import { PackageSortingGame } from './components/PackageSortingGame'
import { CourierDeliveryGame } from './components/CourierDeliveryGame'
import { PackageDeliveryGame } from './components/PackageDeliveryGame'
import { PubModal } from './components/PubModal'
import { QuizGame } from './components/QuizGame'
import { ScoreDisplay } from './components/ScoreDisplay'
import { QuestList } from './components/QuestList'
import { DebugPanel } from './components/DebugPanel'
import { GameCompletionScreen } from './components/GameCompletionScreen'
import { ScoreProvider, useScore } from './contexts/ScoreContext'
import { QuestProvider, useQuest } from './contexts/QuestContext'
import bgSound from './assets/bg-sound.mp3'
import music from './assets/music.mp3'
import './App.css'

type ActiveGame = 'none' | 'package-sorting' | 'courier-delivery' | 'package-delivery' | 'pub' | 'quiz'

function AppContent() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none')
  const [carResetTrigger, setCarResetTrigger] = useState(0)
  const { quests, resetQuests } = useQuest()
  const { resetScore } = useScore()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Zkontrolovat, jestli jsou všechny questy dokončené
  const allQuestsCompleted = quests.every(q => q.completed)

  // Spustit hudbu při načtení hry
  useEffect(() => {
    // Náhodně vybrat jednu z písniček
    const musicTracks = [bgSound, music]
    const randomTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)]
    
    audioRef.current = new Audio(randomTrack)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3 // Nastavit hlasitost na 30%
    
    console.log(`🎵 Vybrána hudba: ${randomTrack === bgSound ? 'bg-sound.mp3' : 'music.mp3'}`)
    
    let musicStarted = false
    
    // Pokus o přehrání hudby po interakci uživatele
    const playAudio = async () => {
      if (musicStarted) return
      
      try {
        if (audioRef.current) {
          await audioRef.current.play()
          musicStarted = true
          console.log('🎶 Hudba spuštěna!')
        }
      } catch {
        // Toto je normální - prohlížeč čeká na interakci uživatele
        console.log('🔇 Čekám na kliknutí nebo stisknutí klávesy pro spuštění hudby...')
      }
    }
    
    // Pokusit se přehrát automaticky
    playAudio()
    
    // Pokud autoplay selže, čekat na první interakci
    const handleFirstInteraction = () => {
      if (!musicStarted) {
        playAudio()
        // Odebrat event listenery po prvním spuštění
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
      }
    }
    
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    
    // Cleanup při unmount
    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleDepotInteraction = () => {
    setActiveGame('package-sorting')
    // Ztlumit hudbu při spuštění minihry
    if (audioRef.current) {
      audioRef.current.volume = 0.05
    }
  }

  const handleLockerInteraction = () => {
    setActiveGame('courier-delivery')
    // Ztlumit hudbu při spuštění minihry
    if (audioRef.current) {
      audioRef.current.volume = 0.05
    }
  }

  const handleShopInteraction = () => {
    setActiveGame('package-delivery')
    // Ztlumit hudbu při spuštění minihry
    if (audioRef.current) {
      audioRef.current.volume = 0.05
    }
  }

  const handleQuizInteraction = () => {
    setActiveGame('quiz')
    // Ztlumit hudbu při spuštění minihry
    if (audioRef.current) {
      audioRef.current.volume = 0.05
    }
  }

  const handlePubInteraction = () => {
    setActiveGame('pub')
    // Ztlumit hudbu při vstupu do hospody
    if (audioRef.current) {
      audioRef.current.volume = 0.05
    }
  }

  const handleCloseGame = () => {
    setActiveGame('none')
    // Vrátit hlasitost hudby po zavření minihry
    if (audioRef.current) {
      audioRef.current.volume = 0.3
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Canvas
        shadows
        camera={{ position: [8, 10, 8], fov: 50 }}
        style={{ background: '#FFB88C' }}
      >
        <Scene 
          onDepotInteraction={handleDepotInteraction}
          onLockerInteraction={handleLockerInteraction}
          onShopInteraction={handleShopInteraction}
          onPubInteraction={handlePubInteraction}
          onQuizInteraction={handleQuizInteraction}
          carResetTrigger={carResetTrigger}
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

      {/* Package Delivery Mini Game */}
      {activeGame === 'package-delivery' && (
        <PackageDeliveryGame onClose={handleCloseGame} />
      )}

      {/* Pub Modal - restartuje hru */}
      {activeGame === 'pub' && (
        <PubModal onRestart={() => { 
          resetQuests() // Resetovat questy
          resetScore() // Resetovat skóre
          setCarResetTrigger(prev => prev + 1) // Resetovat pozici auta
          handleCloseGame() // Zavřít modal
        }} />
      )}

      {/* Quiz Game */}
      {activeGame === 'quiz' && (
        <QuizGame onClose={handleCloseGame} />
      )}

      {/* Debug Panel */}
      <DebugPanel />

      {/* Game Completion Screen */}
      {allQuestsCompleted && <GameCompletionScreen />}
    </div>
  )
}

function App() {
  return (
    <ScoreProvider>
      <QuestProvider>
        <AppContent />
      </QuestProvider>
    </ScoreProvider>
  )
}

export default App
